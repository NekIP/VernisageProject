using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using VernisageProject.DataBase.Repositories;
using VernisageProject.Buisness.Shared.Components.FileManager;

namespace VernisageProject {
	public class Startup {
		// This method gets called by the runtime. Use this method to add services to the container.
		// For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
		public void ConfigureServices(IServiceCollection services) {
			services.AddLocalization(options => options.ResourcesPath = "Resources");
			services.AddMvc()
				.AddViewLocalization();
			ConfigureUserServices(services);
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env) {
			if (env.IsDevelopment()) {      // проект в процессе разработки
				app.UseDeveloperExceptionPage();
				app.UseDatabaseErrorPage();
				app.UseBrowserLink();
			}
			else {
				app.UseExceptionHandler("/Home/Error");     // обработка ошибок
			}

			var supportedCultures = new[] {
				new CultureInfo("en"),
				new CultureInfo("ru")
			};
			app.UseRequestLocalization(new RequestLocalizationOptions {
				DefaultRequestCulture = new RequestCulture("ru"),
				SupportedCultures = supportedCultures,
				SupportedUICultures = supportedCultures
			});
			// установка обработчика статических файлов
			app.UseStaticFiles();
			// установка аутентификации пользователя на основе куки
			app.UseAuthentication();
			// установка компонентов MVC для обработки запроса
			app.UseMvc(routes => {
				routes.MapRoute(
					name: "default",
					template: "{controller=Home}/{action=Home}/{id?}");
			});
		}

		private void ConfigureUserServices(IServiceCollection services) {
			services.AddTransient<IProductsRepository, ProductsRepository>();
			services.AddTransient<IFilesRepository, FilesRepository>();

			services.AddTransient<IFileManager, FileManager>();
		}
	}
}
