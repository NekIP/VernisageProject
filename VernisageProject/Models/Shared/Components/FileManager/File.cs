using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VernisageProject.Models.Shared.Components.FileManager {
	public class File {
		public string Name { get; set; }
		public int Length { get; set; }
		public DateTime DateCreated { get; set; }
		public FileType Type { get; set; }
	}
}
