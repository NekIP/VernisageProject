using System;

namespace VernisageProject.Models.Shared.Components.FileManager {
	public class UserFileApi {
		public string Name { get; set; }
		public long Length { get; set; }
		public DateTime DateCreated { get; set; }
		public string Type { get; set; }
		public string Path { get; set; }
		public string Href { get; set; }

		public static UserFileApi Map(UserFile item) {
			return new UserFileApi {
				Name = item.Name,
				Length = item.Length,
				DateCreated = item.DateCreated,
				Type = item.Type.ToString(),
				Path = item.Path,
				Href = item.Href
			};
		}
	}
}
