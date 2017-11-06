using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace VernisageProject.Buisness.Shared.Components.FileManager {
	public interface IFileManager {
		Task Load(IFormFileCollection files);
	}

	public class FileManager : IFileManager {
		private readonly IHostingEnvironment AppEnvironment;
		public FileManager(IHostingEnvironment appEnvironment) {
			AppEnvironment = appEnvironment;
		}

		public async Task Load(IFormFileCollection files) {
			foreach (var file in files) {
				var filename = ContentDispositionHeaderValue
								.Parse(file.ContentDisposition)
								.FileName
								.Trim('"');
				var path = Path.Combine(AppEnvironment.ContentRootPath, "wwwroot/hosting", filename);
				using (var fileStream = new FileStream(path, FileMode.Create)) {
					using (var fileReading = file.OpenReadStream()) {
						var bytes = new byte[fileReading.Length];
						await fileReading.ReadAsync(bytes, 0, bytes.Length);
						await fileStream.WriteAsync(bytes, 0, bytes.Length);
					}
				}
			}
		}
	}
}
