using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using VernisageProject.DataBase.Repositories;

namespace VernisageProject.Controllers {
	public class HomeController : Controller {
		private IProductsRepository ProductsRepository { get; set; }

		public HomeController(IProductsRepository productRepository) {
			ProductsRepository = productRepository;
		}

		public IActionResult Home() {
			return View();
		}
	}
}