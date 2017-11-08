using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using VernisageProject.Models.Shared.Components.FileManager;

namespace VernisageProject.DataBase.Repositories {
	public interface IFilesRepository : IRepository<UserFile> {
		Task ReplaceFile(string physicalFilePathForReplacement, UserFile fileReplace);
		Task DeleteFile(string physicalFilePath);
		Task CopyFile(string physicalFilePath, string newFileName);
		Task MoveFile(string physicalFilePath, string newPhysicalFilePath, string newFilePath);
		Task<UserFile> GetFileFromPhysicalPath(string physicalFilePath);
		Task<List<UserFile>> FindFile(string keywords);
		Task AddFile(UserFile file, bool withReplacment = false);
		Task RenameFile(string physicalFilePath, string newFileName, bool withReplacment = false);
	}

	public class FilesRepository : Repository<UserFile>, IFilesRepository {
		public FilesRepository(IConfiguration configuration) : base("fileManager", configuration) { }

		public async Task ReplaceFile(string physicalFilePathForReplacement, UserFile fileReplace) {
			await this.Update(x => x.PhysicalPath == physicalFilePathForReplacement, fileReplace);
		}

		public async Task DeleteFile(string physicalFilePath) {
			await this.Remove(x => x.PhysicalPath == physicalFilePath);
		}

		public async Task CopyFile(string physicalFilePath, string newFileName) {		
			var file = await GetFileFromPhysicalPath(physicalFilePath);
			file.PhysicalPath = file.PhysicalPath.Replace(file.Name, newFileName);
			file.Path = file.Path.Replace(file.Name, newFileName);
			file.HRef = file.HRef.Replace(file.Name, newFileName);
			await this.Add(file);
		}

		public async Task MoveFile(string physicalFilePath, string newPhysicalFilePath, string newFilePath) {
			var file = await GetFileFromPhysicalPath(physicalFilePath);
			file.PhysicalPath = newPhysicalFilePath;
			file.Path = newFilePath;
			file.HRef = "-"; // TODO
			await this.Update(x => x.PhysicalPath == physicalFilePath, file);
		}

		public async Task<UserFile> GetFileFromPhysicalPath(string physicalFilePath) {
			var result = (await this.Where(x => x.PhysicalPath == physicalFilePath).Execute())
				.FirstOrDefault();
			if (result != null) {
				return result;
			}
			else {
				throw new FileNotFoundException();
			}
		}

		public Task<List<UserFile>> FindFile(string keywords) {
			return this.Where(x => x.Path.ToLower().Contains(keywords.ToLower())).Execute();
		}

		public async Task AddFile(UserFile file, bool withReplacment = false) {
			var existFile = (await this.Where(x => x.PhysicalPath == file.PhysicalPath).Execute())
				.FirstOrDefault();
			if (existFile != null ) {
				if (withReplacment) {
					await this.ReplaceFile(existFile.PhysicalPath, file);
				}
				else {
					throw new FileAlreadyExist();
				}
			}
			else {
				await this.Add(file);
			}
		}

		public async Task RenameFile(string physicalFilePath, string newFileName, bool withReplacment = false) {
			var file = await GetFileFromPhysicalPath(physicalFilePath);
			var collisionFile = (await this.Where(
					x => x.PhysicalPath == file.PhysicalPath.Replace(file.Name, newFileName)).Execute()
				).FirstOrDefault();
			if (collisionFile == null || withReplacment) {
				file.Name = newFileName;
				file.PhysicalPath = file.PhysicalPath.Replace(file.Name, newFileName);
				file.Path = file.Path.Replace(file.Name, newFileName);
				file.HRef = file.HRef.Replace(file.Name, newFileName);
				await this.Update(x => x.PhysicalPath == physicalFilePath, file);
			}
			else {
				throw new FileAlreadyExist();
			}
		}
	}

	public class FileAlreadyExist : Exception {
		public FileAlreadyExist() {}
		public FileAlreadyExist(string message, Exception innerException) : base(message, innerException) {}
	}
}
