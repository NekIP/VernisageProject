using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VernisageProject.Models.Shared.Input {
	public class SelectViewModel {
		/// <summary>
		/// Heading on a select
		/// </summary>
		public string DeffaultHeader { get; set; }
		/// <summary>
		/// Name of the value for the assignment
		/// </summary>
		public string VariableFieldName { get; set; }
		/// <summary>
		/// Name of the header field in the element
		/// </summary>
		public string HeadingFieldName { get; set; }
		/// <summary>
		/// Name of the value field in the element
		/// </summary>
		public string ValueFieldName { get; set; }
		/// <summary>
		/// Name of massiv
		/// </summary>
		public string ItemsFieldName { get; set; }

		public SelectViewModel(string itemsFieldName,
			string variableFieldName = "item.value",
			string headingFieldName = "heading",
			string valueFieldName = "value",
			string deffaultHeader = "Select item") {
			ItemsFieldName = itemsFieldName;
			VariableFieldName = variableFieldName;
			HeadingFieldName = headingFieldName;
			ValueFieldName = valueFieldName;
			DeffaultHeader = deffaultHeader;
		}
	}
}
