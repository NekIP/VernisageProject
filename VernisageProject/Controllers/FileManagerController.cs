using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace VernisageProject.Controllers {
	[Route("file-manager")]
	public class FileManagerController : Controller {

		private readonly IHostingEnvironment AppEnvironment;
		public FileManagerController(IHostingEnvironment appEnvironment) {
			AppEnvironment = appEnvironment;
		}

		[HttpPost]
		[Route("load")]
		public async Task Load() {
			var files = Request.Form.Files;
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