using System;
using VernisageProject.Models.Shared.Components.FileManager;

namespace VernisageProject.ModelsApi.Shared.Components.FileManager {
	public class UserFileApi {
		public string Name { get; set; }
		public int Length { get; set; }
		public DateTime DateCreated { get; set; }
		public string Type { get; set; }

		public static UserFileApi Map(UserFile item) {
			return new UserFileApi {
				Name = item.Name,
				Length = item.Length,
				DateCreated = item.DateCreated,
				Type = item.Type.ToString()
			};
		}
	}
}
