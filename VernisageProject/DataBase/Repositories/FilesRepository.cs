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

		public async Task CopyFile(string filePath) {
			var file = (await this.Where(x => x.PhysicalPath == filePath).Execute())
				.FirstOrDefault();
			if (file != null) {
				
			}
			else {
				throw new FileNotFoundException();
			}
		}
	}
}
