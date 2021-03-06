﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using VernisageProject.DataBase.Repositories;
using VernisageProject.Models.Shared.Components.FileManager;

namespace VernisageProject.Buisness.Shared.Components.FileManager {
	public interface IFileManager {
		Task Load(string currentPath, IFormFileCollection files);
		Task Delete(string filePath);
		Task Copy(string filePath, string newFileName);
		Task Move(string filePath, string newFilePath);
		Task<List<UserFile>> List(string currentFolder);
	}

	public class FileManager : IFileManager {
		private readonly IHostingEnvironment AppEnvironment;
		private readonly IFilesRepository FilesRepository;
		private readonly string PhysicalBasePath;

		public FileManager(IHostingEnvironment appEnvironment, IFilesRepository filesRepository) {
			AppEnvironment = appEnvironment;
			FilesRepository = filesRepository;
			PhysicalBasePath = AppEnvironment.ContentRootPath.Replace("\\", "/") +  "/wwwroot/hosting"; // TODO user path
		}

		public async Task Load(string currentPath, IFormFileCollection files) {
			foreach (var file in files) {
				var filename = ContentDispositionHeaderValue
								.Parse(file.ContentDisposition)
								.FileName
								.Trim('"');
				var physicalPath = PhysicalBasePath + currentPath + filename;
				await FilesRepository.AddFile(new UserFile {
					DateCreated = DateTime.Now,
					Length = file.Length,
					Name = filename,
					Path = currentPath + filename,
					PhysicalPath = physicalPath,
					Href = physicalPath,
					Type = UserFileType.File
				});
				using (var fileStream = new FileStream(physicalPath, FileMode.OpenOrCreate)) {
					using (var fileReading = file.OpenReadStream()) {
						var bytes = new byte[fileReading.Length];
						await fileReading.ReadAsync(bytes, 0, bytes.Length);
						await fileStream.WriteAsync(bytes, 0, bytes.Length);
					}
				}
			}
		}

		public async Task Delete(string filePath) {
			var physicalFilePath = PhysicalBasePath + filePath;
			File.Delete(physicalFilePath);
			await FilesRepository.DeleteFile(physicalFilePath);
		}

		public async Task Copy(string filePath, string newFileName) {
			File.Copy(PhysicalBasePath + filePath, newFileName);
			await FilesRepository.CopyFile(PhysicalBasePath + filePath, newFileName);
		}

		public async Task Move(string filePath, string newFilePath) {
			var physicalFilePath = PhysicalBasePath + filePath;
			var newPhysicalFilePath = PhysicalBasePath + newFilePath;
			File.Move(physicalFilePath, newPhysicalFilePath);
			await FilesRepository.MoveFile(physicalFilePath, newPhysicalFilePath, newFilePath);
		}

		public async Task<List<UserFile>> List(string currentDirectory) {
			var currentPhysicalDirectory = PhysicalBasePath + currentDirectory;
			var files = await FilesRepository.GetFilesFromDirectory(currentPhysicalDirectory);
			return files;
		}
	}
}
