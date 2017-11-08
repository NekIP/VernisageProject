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
		Task Load(IFormFileCollection files);
	}

	public class FileManager : IFileManager {
		private readonly IHostingEnvironment AppEnvironment;
		private readonly IFilesRepository FilesRepository;
		private readonly string PhysicalBasePath;

		public FileManager(IHostingEnvironment appEnvironment, IFilesRepository filesRepository) {
			AppEnvironment = appEnvironment;
			FilesRepository = filesRepository;
			PhysicalBasePath = Path.Combine(AppEnvironment.ContentRootPath, "wwwroot/hosting");		// TODO: added path for current user
		}

		public async Task Load(IFormFileCollection files) {
			foreach (var file in files) {
				var filename = ContentDispositionHeaderValue
								.Parse(file.ContentDisposition)
								.FileName
								.Trim('"');
				var physicalPath = Path.Combine(PhysicalBasePath, filename);
				await FilesRepository.AddFile(new UserFile {
					DateCreated = DateTime.Now,
					Length = file.Length,
					Name = filename,
					Path = GetCurrentPath(),
					PhysicalPath = PhysicalBasePath + GetCurrentPath(),
					HRef = PhysicalBasePath + GetCurrentPath(),
					Type = FileType.File
				});
				using (var fileStream = new FileStream(physicalPath, FileMode.Create)) {
					using (var fileReading = file.OpenReadStream()) {
						var bytes = new byte[fileReading.Length];
						await fileReading.ReadAsync(bytes, 0, bytes.Length);
						await fileStream.WriteAsync(bytes, 0, bytes.Length);
					}
				}
			}
		}

		public string GetCurrentPath() {
			return "/";
		}

		public async Task Delete(string filePath, string newFileName) {
			
		}
	}
}
