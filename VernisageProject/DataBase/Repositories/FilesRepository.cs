using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using VernisageProject.Models.Shared.Components.FileManager;

namespace VernisageProject.DataBase.Repositories
{
	public interface IFilesRepository : IRepository<File> { }

    public class FilesRepository : Repository<File>, IFilesRepository {
		public FilesRepository(IConfiguration configuration) : base("fileManager", configuration) { }
	}
}
