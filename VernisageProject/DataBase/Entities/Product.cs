using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VernisageProject.DataBase.Entities {
	public class Product : Entity {
		public string Name { get; set; }
		public string Description { get; set; }
		public decimal Price { get; set; }
		public string ImageSource { get; set; }
		public double Rating { get; set; }
	}
}
