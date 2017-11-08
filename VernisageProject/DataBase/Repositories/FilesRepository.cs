using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using VernisageProject.Models.Shared.Components.FileManager;

namespace VernisageProject.DataBase.Repositories {
	public interface IFilesRepository : IRepository<UserFile> { }

	public class FilesRepository : Repository<UserFile>, IFilesRepository {
		public FilesRepository(IConfiguration configuration) : base("fileManager", configuration) { }

		public async Task DeleteFile(string filePath) {
			await this.Remove(x => x.PhysicalPath == filePath);
		}

		public async Task CopyFile(string physicalFilePath, string newFileName) {		
			try {
				var file = await GetFileFromPhysicalPath(physicalFilePath);
				file.PhysicalPath = file.PhysicalPath.Replace(file.Name, newFileName);
				file.Path = file.Path.Replace(file.Name, newFileName);
				file.HRef = file.HRef.Replace(file.Name, newFileName);
				await this.Add(file);
			}
			catch (Exception e) {
				throw e;
			}
		}

		public async Task MoveFile(string physicalFilePath, string newPhysicalFilePath, string newFilePath) {
			try {
				var file = await GetFileFromPhysicalPath(physicalFilePath);
				file.PhysicalPath = newPhysicalFilePath;
				file.Path = newFilePath;
				file.HRef = "-"; // TODO
				await this.Update(x => x.PhysicalPath == physicalFilePath, file);
			}
			catch (Exception e) {
				throw e;
			}
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
	}
}
