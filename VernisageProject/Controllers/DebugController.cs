﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace VernisageProject.Controllers
{
    public class DebugController : Controller
    {
        public IActionResult Demonstration()
        {
            return View();
        }
    }
}