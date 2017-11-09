using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VernisageProject.Buisness.Shared.Components.FileManager;

namespace VernisageProject.Controllers {
	public class TestApi {
		public IFormCollection Data { get; set; }
		public string CurrentPath { get; set; }
	}

	[Route("file-manager")]
	public class FileManagerController : Controller {
		private readonly IFileManager FileManager;
		public FileManagerController(IFileManager fileManager) {
			FileManager = fileManager;
		}

		[HttpPost]
		[Route("load")]
		public async Task Load() {
			var files = Request.Form.Files;
			await FileManager.Load("/", files);
		}
	}
}