using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using VernisageProject.Models.Home;

namespace VernisageProject.DataBase.Repositories {
	public interface IProductsRepository : IRepository<Product> {
		Task<List<Product>> GetMostPopular(int count);
	}

	public class ProductsRepository : Repository<Product>, IProductsRepository {
		public ProductsRepository(IConfiguration configuration) : base("products", configuration) { }

		public Task<List<Product>> GetMostPopular(int count) {
			return this.SortBy(x => x.Rating, SortDirection.Descending).Take(count).Execute();
		}
	}
}
