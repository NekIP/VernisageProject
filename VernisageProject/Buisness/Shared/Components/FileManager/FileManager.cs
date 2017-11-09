using System;
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
	}

	public class FileManager : IFileManager {
		private readonly IHostingEnvironment AppEnvironment;
		private readonly IFilesRepository FilesRepository;
		private readonly string PhysicalBasePath;

		public string CurrentPysicalDirectory {
			get {
				return "/";
			}
		}

		public FileManager(IHostingEnvironment appEnvironment, IFilesRepository filesRepository) {
			AppEnvironment = appEnvironment;
			FilesRepository = filesRepository;
			PhysicalBasePath = Path.Combine(AppEnvironment.ContentRootPath, "wwwroot/hosting");
		}

		public async Task Load(string currentPath, IFormFileCollection files) {
			foreach (var file in files) {
				var filename = ContentDispositionHeaderValue
								.Parse(file.ContentDisposition)
								.FileName
								.Trim('"');
				var physicalPath = Path.Combine(PhysicalBasePath, filename);
				using (var fileStream = new FileStream(physicalPath, FileMode.Create)) {
					using (var fileReading = file.OpenReadStream()) {
						var bytes = new byte[fileReading.Length];
						await fileReading.ReadAsync(bytes, 0, bytes.Length);
						await fileStream.WriteAsync(bytes, 0, bytes.Length);
					}
				}
				await FilesRepository.AddFile(new UserFile {
					DateCreated = DateTime.Now,
					Length = file.Length,
					Name = filename,
					Path = currentPath,
					PhysicalPath = Path.Combine(PhysicalBasePath, CurrentPysicalDirectory, currentPath),
					Href = Path.Combine(PhysicalBasePath, CurrentPysicalDirectory, currentPath),
					Type = UserFileType.File
				});
			}
		}

		public async Task Delete(string filePath) {
			File.Delete(PhysicalBasePath + filePath);
			await FilesRepository.DeleteFile(PhysicalBasePath + filePath);
		}

		public async Task Copy(string filePath, string newFileName) {
			File.Copy(PhysicalBasePath + filePath, newFileName);
			await FilesRepository.CopyFile(PhysicalBasePath + filePath, newFileName);
		}

		public async Task Move(string filePath, string newFilePath) {
			var physicalFilePath = Path.Combine(PhysicalBasePath, CurrentPysicalDirectory, filePath);
			var newPhysicalFilePath = Path.Combine(PhysicalBasePath, CurrentPysicalDirectory, newFilePath);
			File.Move(physicalFilePath, newPhysicalFilePath);
			await FilesRepository.MoveFile(physicalFilePath, newPhysicalFilePath, newFilePath);
		}

		public async Task<List<UserFile>> Folder(string currentFolder) {
			var currentPhysicalFolder = Path.Combine(PhysicalBasePath, CurrentPysicalDirectory, currentFolder);
			var files = await FilesRepository.GetFilesFromFolder(currentPhysicalFolder);
			return files;
		}
	}
}
