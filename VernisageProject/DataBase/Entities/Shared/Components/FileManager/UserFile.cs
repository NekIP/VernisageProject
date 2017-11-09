using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VernisageProject.DataBase;

namespace VernisageProject.Models.Shared.Components.FileManager {
	public class UserFile : Entity {
		public string Name { get; set; }
		public string PhysicalPath { get; set; }
		public string Path { get; set; }
		public string Href { get; set; }
		public long Length { get; set; }
		public DateTime DateCreated { get; set; }
		public UserFileType Type { get; set; }
	}

	public enum UserFileType {
		Folder,
		File
	}
}
