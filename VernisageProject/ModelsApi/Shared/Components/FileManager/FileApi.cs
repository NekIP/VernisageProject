using System;
using VernisageProject.Models.Shared.Components.FileManager;

namespace VernisageProject.ModelsApi.Shared.Components.FileManager {
	public class FileApi {
		public string Name { get; set; }
		public int Length { get; set; }
		public DateTime DateCreated { get; set; }
		public string Type { get; set; }

		public static FileApi Map(File item) {
			return new FileApi {
				Name = item.Name,
				Length = item.Length,
				DateCreated = item.DateCreated,
				Type = item.Type.ToString()
			};
		}
	}
}
