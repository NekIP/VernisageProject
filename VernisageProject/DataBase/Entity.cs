using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;

namespace VernisageProject.DataBase
{
    public class Entity
    {
		[BsonId]
		public long Id { get; set; }
    }
}
