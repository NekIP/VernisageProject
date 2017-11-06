class Info {
	constructor() {
		Info.ShowInfo = function() {
			var pointsStr = "";
			for (var i = 0; i < Drawer.Points.length; i++) {
				pointsStr += "P" + (i + 1) + "(" + Drawer.Points[i].x.toFixed(2) + "," + Drawer.Points[i].y.toFixed(2) 
					+  ", " + Drawer.Points[i].parentFigure + "), ";
			}
			
			var linesStr = "";
			for (var i = 0; i < Drawer.Lines.length; i++) {
				if (Drawer.Lines[i].point2 != undefined) {
					var point = new Point(
						(Drawer.Lines[i].point1.x + Drawer.Lines[i].point2.x) / 2,
						(Drawer.Lines[i].point1.y + Drawer.Lines[i].point2.y) / 2
					);
					linesStr += "L" + (i + 1) + "(" + point.x.toFixed(2) + "," 
						+ point.y.toFixed(2) + ", " 
						+ (Drawer.Lines[i].isP1Inf ? (Drawer.Lines[i].isP2Inf ? "прямая" : "луч") : (Drawer.Lines[i].isP2Inf ? "луч" : "отрезок")) + "), ";
				}
			}

			var figureStr = "";
			for (var i = 0; i < Drawer.Figures.length; i++) {
				if (Drawer.Figures[i] !== undefined) {
					var rect = Drawer.Figures[i].GetRectangle();
					var point = new Point(
						(rect.min.x + rect.max.x) / 2,
						(rect.min.y + rect.max.y) / 2
					);
					figureStr += "F" + (i + 1) + "(" + point.x.toFixed(2) + "," 
						+ point.y.toFixed(2) + "), ";
				}
			}
			
			document.getElementById("console").innerHTML = 
				"Точки(" + Drawer.Points.length + "): " + pointsStr + "<br>" + 
				"Прямые(" + Drawer.Lines.length + "): " + linesStr + "<br>" + 
				"Фигуры(" + Drawer.Figures.length + "): " + figureStr + "<br>"
			;
		}
	}
}

class Controller {
	constructor() {
		Controller.SelectedPoint = -1;
		Controller.SelectedFigure = -1;
		Controller.SelectedBezie = -1;
		Controller.MergePoint1 = undefined;
		Controller.MergePoint2 = undefined;
		Controller.AddedMode = 1; /*1 - points; 2 - lines; 3 - figures; 4 - bezies; 5 - parametric; 6 - merge*/
		Controller.MouseMode = 0; /*0 - ничего не происходит; 1 - перемещаемся; 2 - скролим; 3 - тащим точку; 4 - тащим фигуру; 5 - тащим безье;*/
		
		Controller.BeginPoint = new Point(0, 0);
		
		Controller.KeyPress = function(event) {
			switch (event.keyCode) {
				case 32: // делаем точку бесконечной или наоборот
					if (Controller.SelectedPoint != -1) {
						for (var i = 0; i < Drawer.Lines.length; i++) {
							if (Drawer.Lines[i].point1 == Controller.SelectedPoint) {
								Drawer.Lines[i].isP1Inf = !Drawer.Lines[i].isP1Inf;
								break;
							}
							if (Drawer.Lines[i].point2 == Controller.SelectedPoint) {
								Drawer.Lines[i].isP2Inf = !Drawer.Lines[i].isP2Inf;
								break;
							}
						}
					}
					break;
				case 49:
					Controller.AddedMode = 1;
					document.getElementById("modeInfo").innerHTML = "Работа с точками";
					break;
				case 50:
					Controller.AddedMode = 2;
					document.getElementById("modeInfo").innerHTML = "Работа с прямыми";
					break;
				case 51:
					Controller.AddedMode = 3;
					document.getElementById("modeInfo").innerHTML = "Работа с фигурами";
					break;
				case 52:
					Controller.AddedMode = 4;
					document.getElementById("modeInfo").innerHTML = "Работа с кривыми безье";
					break;
				case 53:
					Controller.AddedMode = 5;
					document.getElementById("modeInfo").innerHTML = "Работа с параметрическими кривыми";
					break;
				case 54:
					Controller.AddedMode = 6;
					document.getElementById("modeInfo").innerHTML = "Инструмент слияния точек";
					break;
				default:
					// заканчиваем рисование фигур если они рисовались
					if (Drawer.Figures.length != 0 && Drawer.Figures[Drawer.Figures.length - 1] !== undefined) {
						Drawer.Figures[Drawer.Figures.length] = undefined;
					}
					if (Drawer.Bezies.length != 0 && Drawer.Bezies[Drawer.Bezies.length - 1] !== undefined) {
						Drawer.Bezies[Drawer.Bezies.length] = undefined;
					}
					break;
			}
		}
		
		Controller.OnDown = function(event) {
			switch (event.button) {
				// нажата левая клавиша мыши, начинаем перемещаться по canvas
				case 0:
					Controller.BeginPoint = new Point(event.clientX, event.clientY);
					Controller.MouseMode = 1; // режим перемещения по canvas
					return;
				// нажата правая клавиша мыши
				case 2:
					if (Controller.SelectedPoint != -1 && Controller.AddedMode != 6) {;
						// тащим точку
						Controller.MouseMode = 3;
					}
					else {
						if (Controller.SelectedFigure != -1) {
							// тащим фигуру
							Controller.MouseMode = 4;
							Controller.BeginPoint = Point.GetDecart(
								new Point(
									Point.GetLocalX(event.clientX), 
									Point.GetLocalY(event.clientY)
								)
							);
						}
						else {
							if (Controller.SelectedBezie != -1) {
								// тащим безье
								Controller.MouseMode = 5;
								Controller.BeginPoint = Point.GetDecart(
									new Point(
										Point.GetLocalX(event.clientX), 
										Point.GetLocalY(event.clientY)
									)
								);
							}
							else {
								// добавляем точку
								switch (Controller.AddedMode) {
									// добавляем в точки
									case 1:
										Drawer.Points[Drawer.Points.length] = 
											Point.GetDecart(
												new Point(
													Point.GetLocalX(event.clientX), 
													Point.GetLocalY(event.clientY)
												)
											);
											
										if (Drawer.Figures.length != 0 && Drawer.Figures[Drawer.Figures.length - 1] !== undefined) {
											Drawer.Figures[Drawer.Figures.length] = undefined;
										}
										break;	
									// добавляем прямые
									case 2:
										if (Drawer.Lines.length != 0 && Drawer.Lines[Drawer.Lines.length - 1].point2 === undefined) {
											Drawer.Lines[Drawer.Lines.length - 1].point2 = 
												Point.GetDecart(
													new Point(
														Point.GetLocalX(event.clientX), 
														Point.GetLocalY(event.clientY)
													)
												);
										}
										else {
											Drawer.Lines[Drawer.Lines.length] = new Line(
												Point.GetDecart(
													new Point(
														Point.GetLocalX(event.clientX), 
														Point.GetLocalY(event.clientY)
													)
												),
												undefined,
												false,
												false);
										}
										
										if (Drawer.Figures.length != 0 && Drawer.Figures[Drawer.Figures.length - 1] !== undefined) {
											Drawer.Figures[Drawer.Figures.length] = undefined;
										}
										
										break;
									// добавляем фигуры
									case 3:
										if (Drawer.Figures.length != 0) {
											if (Drawer.Figures[Drawer.Figures.length - 1] !== undefined) {
												Drawer.Figures[Drawer.Figures.length - 1].points[Drawer.Figures[Drawer.Figures.length - 1].points.length] = 
													Point.GetDecart(
														new Point(
															Point.GetLocalX(event.clientX), 
															Point.GetLocalY(event.clientY)
														)
													);
											}
											else {
												Drawer.Figures[Drawer.Figures.length - 1] = new Figure(
													Point.GetDecart(
														new Point(
															Point.GetLocalX(event.clientX), 
															Point.GetLocalY(event.clientY)
														)
													)
												);
											}
										}
										else {
											Drawer.Figures[Drawer.Figures.length] = new Figure(
												Point.GetDecart(
													new Point(
														Point.GetLocalX(event.clientX), 
														Point.GetLocalY(event.clientY)
													)
												)
											);
										}
										break;
									case 4:
										if (Drawer.Bezies.length != 0) {
											if (Drawer.Bezies[Drawer.Bezies.length - 1] !== undefined) {
												if (Drawer.Bezies[Drawer.Bezies.length - 1].point2 == undefined)
												{
													Drawer.Bezies[Drawer.Bezies.length - 1].point2 = Point.GetDecart(
														new Point(
															Point.GetLocalX(event.clientX), 
															Point.GetLocalY(event.clientY)
														)
													);
													
												}
												else {
													if (Drawer.Bezies[Drawer.Bezies.length - 1].points == undefined) 
														Drawer.Bezies[Drawer.Bezies.length - 1].points = [];
													if (Drawer.Bezies[Drawer.Bezies.length - 1].points.length < 2) {
														Drawer.Bezies[Drawer.Bezies.length - 1].points[Drawer.Bezies[Drawer.Bezies.length - 1].points.length] = 
															Point.GetDecart(
																new Point(
																	Point.GetLocalX(event.clientX), 
																	Point.GetLocalY(event.clientY)
																)
															);
													}
													else {
														if (Drawer.Bezies.length != 0 && Drawer.Bezies[Drawer.Bezies.length - 1] !== undefined) {
															Drawer.Bezies[Drawer.Bezies.length] = undefined;
														}
													}
												}
											}
											else {
												Drawer.Bezies[Drawer.Bezies.length - 1] = new Bezie(
													Point.GetDecart(
														new Point(
															Point.GetLocalX(event.clientX), 
															Point.GetLocalY(event.clientY)
														)
													),
													undefined,
													[]
												);
											}
										}
										else {
											Drawer.Bezies[Drawer.Bezies.length] = new Bezie(
												Point.GetDecart(
													new Point(
														Point.GetLocalX(event.clientX), 
														Point.GetLocalY(event.clientY)
													)
												),
												undefined,
												[]
											);
										}
										
										break;
									// параметрические
									case 5:
										break;
									// иструмент слияния точек
									case 6:
										if (Controller.MergePoint1 == undefined) {
											Controller.MergePoint1 = Controller.PointUnderMouse(event);
										}
										else {
											if (Controller.MergePoint2 == undefined) {
												Controller.MergePoint2 = Controller.PointUnderMouse(event);
											}
											
											var p = new Point(Controller.MergePoint2.x, Controller.MergePoint2.y);
											Controller.MergePoint1.x = p.x;
											Controller.MergePoint2.x = p.x;
											Controller.MergePoint1.y = p.y;
											Controller.MergePoint2.y = p.y;
											Controller.MergePoint1 = undefined;
											Controller.MergePoint2 = undefined;
										}
										
										break;
								}
							}
						}
					}
					break;
				// ничего не происходит
				default:
					Controller.MouseMode = 0;
			}
		}
		
		Controller.OnDrag = function(event) {
			switch (Controller.MouseMode) {
				// перемещение
				case 1:
					var dr1 = document.getElementById('form1').dr.value;
					Drawer.bias.x += (Controller.BeginPoint.x - event.clientX) / 20 * dr1;
					Drawer.bias.y += (Controller.BeginPoint.y - event.clientY) / 20 * dr1;
					Controller.BeginPoint = new Point(event.clientX, event.clientY);
					break;
				// тащим точку
				case 3:
					var p = Point.GetDecart(
						new Point(
							Point.GetLocalX(event.clientX), 
							Point.GetLocalY(event.clientY)
						)
					);
					Controller.SelectedPoint.x = p.x;
					Controller.SelectedPoint.y = p.y;
					break;
				// тащим фигуру
				case 4: 
					var p = Point.GetDecart(
						new Point(
							Point.GetLocalX(event.clientX), 
							Point.GetLocalY(event.clientY)
						)
					);
					for (var i = 0; i < Controller.SelectedFigure.points.length; i++) {
						
						Controller.SelectedFigure.points[i].x -= (Controller.BeginPoint.x - p.x);
						Controller.SelectedFigure.points[i].y -= (Controller.BeginPoint.y - p.y);
					}
					
					Controller.BeginPoint = p;
					break;
				// тащим безье
				case 5: 
					var p = Point.GetDecart(
						new Point(
							Point.GetLocalX(event.clientX), 
							Point.GetLocalY(event.clientY)
						)
					);
					for (var i = 0; i < Controller.SelectedBezie.points.length; i++) {
						
						Controller.SelectedBezie.points[i].x -= (Controller.BeginPoint.x - p.x);
						Controller.SelectedBezie.points[i].y -= (Controller.BeginPoint.y - p.y);
					}

					Controller.SelectedBezie.point1.x -= (Controller.BeginPoint.x - p.x);
					Controller.SelectedBezie.point1.y -= (Controller.BeginPoint.y - p.y);
					
					if (Controller.SelectedBezie.point2 !== undefined) {
						Controller.SelectedBezie.point2.x -= (Controller.BeginPoint.x - p.x);
						Controller.SelectedBezie.point2.y -= (Controller.BeginPoint.y - p.y);
					}
					
					Controller.BeginPoint = p;
					break;
			}
			
			Draw(document.getElementById('form1'), event);
			Controller.SelectedPoint = Controller.PointUnderMouse(event);
			Controller.SelectedFigure = Controller.FigureUnderMouse(event);
			Controller.SelectedBezie = Controller.BezieUnderMouse(event);
		}
		
		Controller.PointUnderMouse = function(event) {
			var points = Drawer.GetAllPointsInScene();
			var m = Point.GetDecart(new Point(Point.GetLocalX(event.clientX), Point.GetLocalY(event.clientY)));

			for (var i = 0; i < points.length; i++) {
				//попала ли мышь в точку
				if (m.x < (points[i].x + 0.3) && m.x > (points[i].x - 0.3) && m.y < (points[i].y + 0.3) && m.y > (points[i].y - 0.3))
				{
					Drawer.ctx.beginPath();
					Drawer.ctx.fillStyle = 'blue';
					Drawer.ctx.fillRect(Point.GetScreenX(points[i].x) - 5, Point.GetScreenY(points[i].y) - 5, 10, 10);
					Drawer.ctx.closePath();
					Drawer.ctx.stroke();
					return points[i];
				}
			}

			return -1;
		}
		
		Controller.FigureUnderMouse = function(event) {
			var Figures = Drawer.Figures ;
			var m = Point.GetDecart(new Point(Point.GetLocalX(event.clientX), Point.GetLocalY(event.clientY)));
			
			for (var i = 0; i < Figures.length; i++) {
				if (Figures[i] !== undefined) {
					var rect = Figures[i].GetRectangle();
					//попала ли мышь в прямоугольник
					if (m.x < rect.max.x && m.x > rect.min.x && m.y < rect.max.y && m.y > rect.min.y)
					{
						Drawer.DrawRectangle(rect);
						return Figures[i];
					}
				}
			}

			return -1;
		}
		
		Controller.BezieUnderMouse = function(event) {
			var Bezies = Drawer.Bezies ;
			var m = Point.GetDecart(new Point(Point.GetLocalX(event.clientX), Point.GetLocalY(event.clientY)));
			
			for (var i = 0; i < Bezies.length; i++) {
				if (Bezies[i] !== undefined) {
					var rect = Bezies[i].GetRectangle();
					//попала ли мышь в прямоугольник
					if (m.x < rect.max.x && m.x > rect.min.x && m.y < rect.max.y && m.y > rect.min.y)
					{
						Drawer.DrawRectangle(rect);
						return Bezies[i];
					}
				}
			}

			return -1;
		}
		
		Controller.OnUp = function() {
			Controller.MouseMode = 0;
		}
		
		Controller.OnWheel = function(event) {
			event = event || window.event;
			var delta = event.deltaY || event.detail || event.wheelDelta;
			var pr1 = document.getElementById('form1').pr.value;
			
			Drawer.scale = Drawer.scale + (delta < 0 ? -1 : 1) * 0.25 * pr1;
			if (Drawer.scale < 0) {
				Drawer.scale = 0;
			}
			
			Draw(document.getElementById('form1'), event);
			event.preventDefault ? event.preventDefault() : (event.returnValue = false);
		}
	}
}

class Drawer {
	constructor() {

/*-----Статичные поля-----*/	
		Drawer.Points = [];
		Drawer.Figures = [];
		Drawer.Lines = [];
		Drawer.Bezies = [];
		Drawer.ParametrizideCurves = [];

		Drawer.elems = document.getElementById("form1").elements;
		Drawer.canvas = document.getElementById("canvas");
		Drawer.ctx = canvas.getContext('2d');
		
		Drawer.bias = new Point(0, 0);
		Drawer.scale = 10;
		Drawer.x1 = Drawer.bias.x - Drawer.scale - 1;
		Drawer.x2 = Drawer.bias.x + Drawer.scale + 1;
		Drawer.y1 = Drawer.bias.y - Drawer.scale - 1;
		Drawer.y2 = Drawer.bias.y + Drawer.scale + 1;
		Drawer.I1 = 3;
		Drawer.I2 = Drawer.canvas.width - 3;
		Drawer.J1 = 3;
		Drawer.J2 = Drawer.canvas.height - 3;
	
/*----------Статичные методы----------*/
		/*Подготовка canvas, очистка, рисование сетки*/
		Drawer.DrawCanvas = function() {
			Drawer.ClearCanvas();
			Drawer.Calculate();
			Drawer.DrawCoordCage();
		}
		
		Drawer.DrawMouse = function(event) {
			var pointZero = Point.GetScreen(new Point(0, 0));
			var mouse = Point.GetDecart(new Point(Point.GetLocalX(event.clientX), Point.GetLocalY(event.clientY), false));
			
			if (pointZero.y < 0) {
				pointZero.y = 15;
			}
			
			if (pointZero.y > Drawer.J2) {
				pointZero.y = Drawer.J2 - 15;
			}
			
			if (pointZero.x < 0) {
				pointZero.x = 15;
			}
			
			if (pointZero.x > Drawer.I2) {
				pointZero.x = Drawer.I2 - 15;
			}
			
			Drawer.ctx.beginPath();
			Drawer.ctx.font = "italic 9pt Arial";
			Drawer.ctx.fillStyle = '#000';
			Drawer.ctx.fillText("(" + mouse.x.toFixed(2) + ", ", Point.GetLocalX(event.clientX), Point.GetLocalY(event.clientY));
			Drawer.ctx.fillText(-mouse.y.toFixed(2) + ")", 
				Point.GetLocalX(event.clientX) +  (Point.GetLocalX(event.clientX) % 10 + 40), 
				Point.GetLocalY(event.clientY));
			Drawer.ctx.stroke();
			
			Drawer.ctx.beginPath();
			Drawer.ctx.fillStyle = 'red';
			Drawer.ctx.fillRect(pointZero.x - 3, Point.GetLocalY(event.clientY) - 3, 6, 6);
			Drawer.ctx.fillRect(Point.GetLocalX(event.clientX) - 3, pointZero.y - 3, 6, 6);
			Drawer.ctx.stroke();
			
			Drawer.ctx.beginPath();
			Drawer.ctx.lineWidth = 1;
			Drawer.ctx.strokeStyle = "gray";
			Drawer.ctx.moveTo(Point.GetLocalX(event.clientX), Point.GetLocalY(event.clientY));
			Drawer.ctx.lineTo(pointZero.x, Point.GetLocalY(event.clientY));
			Drawer.ctx.moveTo(Point.GetLocalX(event.clientX), Point.GetLocalY(event.clientY));
			Drawer.ctx.lineTo(Point.GetLocalX(event.clientX), pointZero.y);
			Drawer.ctx.stroke();
		}
	
		Drawer.DrawCoordCage = function() {
			var pointZero = Point.GetScreen(new Point(0, 0));
			var point1 = Point.GetScreen(new Point(Drawer.x1, Drawer.y1));
			var point2 = Point.GetScreen(new Point(Drawer.x2, Drawer.y2));
			
			if (pointZero.y < 0) {
				pointZero.y = 15;
			}
			
			if (pointZero.y > Drawer.J2) {
				pointZero.y = Drawer.J2 - 15;
			}
			
			if (pointZero.x < 0) {
				pointZero.x = 15;
			}
			
			if (pointZero.x > Drawer.I2) {
				pointZero.x = Drawer.I2 - 15;
			}
			//координатная сетка:
			Drawer.ctx.strokeStyle = "rgba(100, 0, 0, 0.4)";
			Drawer.ctx.lineWidth = 1;
			var tap = Drawer.scale > 10 ? Math.floor(Drawer.scale / 10) : 1;		
			if (tap == 0) {
				tap = 1;
			}
			
			for (var y = 0; y < Drawer.y2; y += tap) {
				if (y != 0) {
					Drawer.ctx.font = "italic 9pt Arial";
					Drawer.ctx.fillStyle = '#000';
					Drawer.ctx.fillText(-y, pointZero.x, Point.GetScreenY(y));
				}
				
				Drawer.ctx.moveTo(point1.x, Point.GetScreenY(y));
				Drawer.ctx.lineTo(point2.x, Point.GetScreenY(y));
			}
			
			for (var y = 0; y >= Drawer.y1; y -= tap) {
				if (y != 0) {
					Drawer.ctx.font = "italic 9pt Arial";
					Drawer.ctx.fillStyle = '#000';
					Drawer.ctx.fillText(-y, pointZero.x, Point.GetScreenY(y));
				}
				
				Drawer.ctx.moveTo(point1.x, Point.GetScreenY(y));
				Drawer.ctx.lineTo(point2.x, Point.GetScreenY(y));
			}
			
			for (var x = 0; x < Drawer.x2; x += tap) {
				if (x != 0) {
					Drawer.ctx.font = "italic 9pt Arial";
					Drawer.ctx.fillStyle = '#000';
					Drawer.ctx.fillText(x, Point.GetScreenX(x), pointZero.y);
				}
				
				Drawer.ctx.moveTo(Point.GetScreenX(x), point1.y);
				Drawer.ctx.lineTo(Point.GetScreenX(x), point2.y);
			}
			
			for (var x = 0; x >= Drawer.x1; x -= tap) {
				if (x != 0) {
					Drawer.ctx.font = "italic 9pt Arial";
					Drawer.ctx.fillStyle = '#000';
					Drawer.ctx.fillText(x, Point.GetScreenX(x), pointZero.y);
				}
				Drawer.ctx.moveTo(Point.GetScreenX(x), point1.y);
				Drawer.ctx.lineTo(Point.GetScreenX(x), point2.y);
			}
			
			Drawer.ctx.stroke();
			
			//оси координат:
			Drawer.ctx.beginPath();
			
			Drawer.ctx.lineWidth = 2;
			Drawer.ctx.strokeStyle = "navy";
			Drawer.ctx.font = "italic 9pt Arial";
			Drawer.ctx.fillStyle = '#000';
			
			Drawer.ctx.moveTo(point1.x, pointZero.y);
			Drawer.ctx.lineTo(point2.x, pointZero.y);
			
			if ((pointZero.x >= 0 && pointZero.x < Drawer.I2) 
				|| (pointZero.y >= 0 && pointZero.y < Drawer.J2))
				Drawer.ctx.fillText(0, pointZero.x, pointZero.y);
				
			Drawer.ctx.moveTo(pointZero.x, point1.y);
			Drawer.ctx.lineTo(pointZero.x, point2.y);
			
			Drawer.ctx.closePath();
			Drawer.ctx.stroke();
		};
		
		/*Очистка canvas*/
		Drawer.ClearCanvas = function() {
			Drawer.ctx.beginPath(); 
			Drawer.ctx.fillStyle = '#FFFFCF';
			Drawer.ctx.clearRect(0, 0, Drawer.canvas.width, Drawer.canvas.height);
			Drawer.ctx.fillRect(0, 0, Drawer.canvas.width, Drawer.canvas.height);
			Drawer.ctx.strokeStyle = "navy";
			Drawer.ctx.strokeRect(0, 0, Drawer.canvas.width, Drawer.canvas.height);
			Drawer.ctx.closePath(); 
			Drawer.ctx.stroke();
		};
	
		Drawer.DrawText = function(text, point) {
			if (point !== undefined) {
				Drawer.ctx.beginPath();
				Drawer.ctx.font = "italic 9pt Arial";
				Drawer.ctx.fillStyle = '#000';
				Drawer.ctx.fillText(text, Point.GetScreenX(point.x), Point.GetScreenY(point.y));
				Drawer.ctx.closePath();
				Drawer.ctx.stroke();
			}
		}
	
		Drawer.DrawAllPoints = function() {
			var points = Drawer.Points;
			for (var i = 0; i < points.length; i++) {
				Drawer.DrawText("P" + (i + 1), points[i]);
			}
			points = Drawer.GetAllPointsInScene();
			for (var i = 0; i < points.length; i++) {
				Drawer.DrawPoint(points[i]);
			}
		}
	
		Drawer.DrawAllLines = function() {
			var lines = Drawer.Lines;
			for (var i = 0; i < lines.length; i++) {
				Drawer.DrawLine(lines[i]);
				if (lines[i].point2 != undefined) {
					Drawer.DrawText("L" + (i + 1), 
						new Point(
							(lines[i].point1.x + lines[i].point2.x) / 2,
							(lines[i].point1.y + lines[i].point2.y) / 2
						)
					);
				}
			}
			
			var lines1 = Drawer.GetAllLinesInScene();
			for (var i = 0; i < lines1.length; i++) {
				for (var j = i; j < lines1.length; j++) {
					
					var pere = Line.GetPointPere(lines1[i], lines1[j], true);
					Drawer.DrawPoint(pere, "green");
					if (pere !== undefined) {
						Drawer.DrawText("(" + pere.x.toFixed(2) + ", " + pere.y.toFixed(2) + ")", pere);
					}
				}
			}
		}
	
		Drawer.DrawAllFigure = function() {
			var figures = Drawer.Figures;
			for (var i = 0; i < figures.length; i++) {
				Drawer.DrawFigure(figures[i]);
				if (Drawer.Figures[i] !== undefined) {	
					var rect = Drawer.Figures[i].GetRectangle();
					var point = new Point(
						(rect.min.x + rect.max.x) / 2,
						(rect.min.y + rect.max.y) / 2
					);
					Drawer.DrawText("F" + (i + 1), point);
				}
			}
		}
	
		Drawer.DrawAllBezie = function() {
			var bezies = Drawer.Bezies;
			for (var i = 0; i < bezies.length; i++) {
				Drawer.DrawBezie(bezies[i]);
			}
		}
	
		Drawer.DrawFigure = function(figure) {
			if (figure !== undefined) {
				if (figure.points.length > 1) {
					for (var i = 0; i < figure.points.length - 1; i++) {
						if (figure.points[i + 1] !== undefined) {
							Drawer.DrawLine(new Line(figure.points[i], figure.points[i + 1]));
						}
					}
					Drawer.DrawLine(new Line(figure.points[0], figure.points[figure.points.length - 1]));
				}
			}
		}
	
		Drawer.DrawBezie = function(bezie) {
			if (bezie !== undefined) {
				var points = bezie.GetPoints();
				for (var i = 0; i < points.length - 1; i++) {
					Drawer.DrawLine(new Line(points[i], points[i + 1]));
				}
			}
		}
	
		/*Рисование точки*/
		Drawer.DrawPoint = function(point, color) {
			if (point !== undefined) {
				var p = Point.GetScreen(point);
				Drawer.ctx.beginPath();
				Drawer.ctx.fillStyle = color !== undefined ? color : 'red';
				Drawer.ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
				Drawer.ctx.closePath();
				Drawer.ctx.stroke();
			}
		}
		
		/*Рисование линии*/
		Drawer.DrawLine = function(line, color, lineWidth) {
			var p1 = Point.GetScreen(line.GetConvertedPoint1());
			if (line.point2 !== undefined) {
				var p2 = Point.GetScreen(line.GetConvertedPoint2());
				
				Drawer.ctx.beginPath();
				Drawer.ctx.lineWidth = lineWidth == undefined ? 2 : lineWidth;
				Drawer.ctx.strokeStyle = color == undefined ? "gray" : color;
				Drawer.ctx.moveTo(p1.x, p1.y);
				Drawer.ctx.lineTo(p2.x, p2.y);
				Drawer.ctx.closePath();
				Drawer.ctx.stroke();
			}
		}
		
		/*Рисование прямоугольника*/
		Drawer.DrawRectangle = function(rectangle) {
			var min = Point.GetScreen(rectangle.min);
			var max = Point.GetScreen(rectangle.max);
			Drawer.ctx.beginPath();
			Drawer.ctx.lineWidth = 1;
			Drawer.ctx.strokeStyle = "red";
			
			Drawer.ctx.moveTo(min.x, min.y);
			Drawer.ctx.lineTo(max.x, min.y);
			
			Drawer.ctx.moveTo(max.x, min.y);
			Drawer.ctx.lineTo(max.x, max.y);
			
			Drawer.ctx.moveTo(max.x, max.y);
			Drawer.ctx.lineTo(min.x, max.y);
			
			Drawer.ctx.moveTo(min.x, max.y);
			Drawer.ctx.lineTo(min.x, min.y);
			
			Drawer.ctx.closePath();
			Drawer.ctx.stroke();
		}
		
		Drawer.Calculate = function(point) {
			Drawer.y2 = Drawer.bias.y + Drawer.scale + 1; 
			Drawer.y1 = Drawer.bias.y - Drawer.scale - 1;
			Drawer.x1 = Drawer.bias.x - Drawer.scale - 1; 
			Drawer.x2 = Drawer.bias.x + Drawer.scale + 1;
		}
		
		Drawer.GetAllPointsInScene = function() {
			/*Controller.Points = [];
			Controller.Figure = [];
			Controller.Lines = [];
			Controller.Bezies = [];
			Controller.ParametrizideCurves = [];*/
			
			var points = [];
			points = points.concat(Drawer.Points);
			for (var i = 0; i < Drawer.Lines.length; i++) {
				points[points.length] = Drawer.Lines[i].point1;
				if (Drawer.Lines[i].point2 !== undefined) {
					points[points.length] = Drawer.Lines[i].point2;
				}
			}
			
			for (var i = 0; i < Drawer.Figures.length; i++) {
				if (Drawer.Figures[i] !== undefined) {
					for (var j = 0; j < Drawer.Figures[i].points.length; j++) {
						if (Drawer.Figures[i].points[j] !== undefined) {
							points[points.length] = Drawer.Figures[i].points[j];
						}
					}
				}
			}
			
			for (var i = 0; i < Drawer.Bezies.length; i++) {
				if (Drawer.Bezies[i] !== undefined) {
					if (Drawer.Bezies[i].points !== undefined) {
						for (var j = 0; j < Drawer.Bezies[i].points.length; j++) {
							if (Drawer.Bezies[i].points[j] !== undefined) {
								points[points.length] = Drawer.Bezies[i].points[j];
							}
						}
					}
					points[points.length] = Drawer.Bezies[i].point1;
					if (Drawer.Bezies[i].point2 !== undefined) {
						points[points.length] = Drawer.Bezies[i].point2;
					}
				}
			}
			
			return points;
		}
		
		Drawer.GetAllLinesInScene = function() {
			var lines = [];
			
			for (var i = 0; i < Drawer.Lines.length; i++) {
				if (Drawer.Lines[i] !== undefined) {
					lines[lines.length] = new Line(Drawer.Lines[i].point1, Drawer.Lines[i].point2, Drawer.Lines[i].isP1Inf, Drawer.Lines[i].isP2Inf);
				}
			}
			
			for (var i = 0; i < Drawer.Figures.length; i++) {
				if (Drawer.Figures[i] !== undefined) {
					if (Drawer.Figures[i].points.length > 1) {
						for (var j = 0; j < Drawer.Figures[i].points.length; j++) {
							if (Drawer.Figures[i].points[j + 1] !== undefined) {
								lines[lines.length] = new Line(Drawer.Figures[i].points[j], Drawer.Figures[i].points[j + 1]);
							}
						}
						
						lines[lines.length] = new Line(Drawer.Figures[i].points[0], Drawer.Figures[i].points[Drawer.Figures[i].points.length - 1]);
					}
				}
			}
			
			return lines;
		}
		
		Drawer.InitializePointInFigure = function() {
			var figures = Drawer.Figures;
			var points = Drawer.Points;

			for (var i = 0; i < figures.length; i++) {
				if (figures[i] !== undefined) {	
					for (var j = 0; j < points.length; j++) {
						if (Figure.IsPointInFigure(figures[i], points[j])) {
							points[j].parentFigure = "F" + (i + 1);
						}
						else {
							points[j].parentFigure = "none";
						}
					}
				}
			}
		}
	}
}

class Point {
	constructor(x, y, isDecart) {
		
/*-----Поля-----*/	
		this.x = x;
		this.y = y;
		this.parentFigure = "none";
		
		// по дефолту координаты считаются декартовыми
		if (isDecart === undefined) {
			this.isDecart = true;
		}
		else {
			this.isDecart = isDecart;
		}
		
/*----------Методы----------*/
		this.ToScreen = function() {
			if (this.isDecart) {
				this.x = Drawer.I1 + (Drawer.I2 - Drawer.I1) * (this.x - Drawer.x1) / (Drawer.x2 - Drawer.x1);
				this.y = Drawer.J1 + (Drawer.J2 - Drawer.J1) * (this.y - Drawer.y1) / (Drawer.y2 - Drawer.y1);
				this.isDecart = false;
			}
		}
		
		this.ToDecart = function() {
			if (!this.isDecart) {
				this.x = Drawer.x1 + (Drawer.x2 - Drawer.x1) * (this.x - Drawer.I1) / (Drawer.I2 - Drawer.I1);
				this.y = Drawer.y1 + (Drawer.y2 - Drawer.y1) * (this.y - Drawer.J1) / (Drawer.J2 - Drawer.J1);
				this.isDecart = true;
			}
		}
		
/*----------Статичные методы----------*/
		Point.GetScreen = function(point) {
			return new Point(
				Drawer.I1 + (Drawer.I2 - Drawer.I1) * (point.x - Drawer.x1) / (Drawer.x2 - Drawer.x1),
				Drawer.J1 + (Drawer.J2 - Drawer.J1) * (point.y - Drawer.y1) / (Drawer.y2 - Drawer.y1),
				false
			);
		}
		
		Point.GetScreenX = function(x) {
			return Drawer.I1 + (Drawer.I2 - Drawer.I1) * (x - Drawer.x1) / (Drawer.x2 - Drawer.x1);
		}
		
		Point.GetScreenY = function(y) {
			return Drawer.J1 + (Drawer.J2 - Drawer.J1) * (y - Drawer.y1) / (Drawer.y2 - Drawer.y1);
		}
		
		Point.GetLocalX = function(x) {
			return x - 10 >= 0 ? x - 10 : 0;
		}
		
		Point.GetLocalY = function(y) {
			return y - 10 >= 0 ? y - 10 : 0;
		}
		
		Point.GetDecart = function(point) {
			return new Point(
				Drawer.x1 + (Drawer.x2 - Drawer.x1) * (point.x - Drawer.I1) / (Drawer.I2 - Drawer.I1),
				Drawer.y1 + (Drawer.y2 - Drawer.y1) * (point.y - Drawer.J1) / (Drawer.J2 - Drawer.J1),
				true
			)
		}
		
		Point.Scalar = function(point1, point2) {
			return ((point1.x * point2.x) + (point1.y * point2.y));
		}
	}
}

class Line {
	constructor(point1, point2, isP1Inf, isP2Inf) {
		this.point1 = point1;
		this.point2 = point2;
		this.isP1Inf = isP1Inf == undefined ? false : isP1Inf;
		this.isP2Inf = isP2Inf == undefined ? false : isP2Inf;
		
		if (point1 !== undefined && point2 !== undefined) {
			this.A = point2.y - point1.y;
			this.B = point1.x - point2.x;
			this.C = point2.x * point1.y - point1.x * point2.y;
		}
		
		this.GetConvertedPoint1 = function() {		
			if (this.point1 !== undefined && this.point2 !== undefined) {
				this.A = this.point2.y - this.point1.y;
				this.B = this.point1.x - this.point2.x;
				this.C = this.point2.x * this.point1.y - this.point1.x * this.point2.y;
			}
			if (this.isP1Inf) {
				var x = this.point1.x < this.point2.x ? Drawer.x1 : Drawer.x2;
				var y = (-this.C - this.A * x) / this.B;
				return new Point(x, y);
			}
			else {
				return this.point1;
			}
		};
		
		this.GetConvertedPoint2 = function() {
			if (this.point1 !== undefined && this.point2 !== undefined) {
				this.A = this.point2.y - this.point1.y;
				this.B = this.point1.x - this.point2.x;
				this.C = this.point2.x * this.point1.y - this.point1.x * this.point2.y;
			}
			if (this.isP2Inf) {
				var x = this.point2.x < this.point1.x ? Drawer.x1 : Drawer.x2;
				var y = (-this.C - this.A * x) / this.B;
				return new Point(x, y);
			}
			else {
				return this.point2;
			}
		};
		
		Line.GetPointPere = function(line1, line2, isForDraw) {
			if (line1.A == line2.A && line1.B == line2.B) {
				// прямые параллельны
				return undefined;
			}
			else {
				var pere = new Point(0, 0);
				
				pere.y = (((line1.A * line2.C) / line2.A) - line1.C) / (((-line1.A * line2.B) / line2.A) + line1.B);
				pere.x = (-line2.B * pere.y - line2.C) / line2.A
				
				if (isForDraw) {
					var l1 = new Line(line1.GetConvertedPoint1(), line1.GetConvertedPoint2());
					var l2 = new Line(line2.GetConvertedPoint1(), line2.GetConvertedPoint2());
					
					if ((l1.point1.x == l2.point1.x && l1.point1.y == l2.point1.y) 
						|| (l1.point1.x == l2.point2.x && l1.point1.y == l2.point2.y)
						|| (l1.point2.x == l2.point2.x && l1.point2.y == l2.point2.y)) {
						return undefined;
					}
					
					if (Line.IsPointInBorder(l1, pere) && Line.IsPointInBorder(l2, pere)) {
						return pere;
					}
				}
				
				return undefined;
			}
		};
		
		Line.IsPointInBorder = function(line, point) {
			if (line.point1 == undefined || line.point2 == undefined || point == undefined) {
				return false;
			}
			
			var vector1 = new Point(line.point1.x - point.x, line.point1.y - point.y);
			var vector2 = new Point(line.point2.x - point.x, line.point2.y - point.y);

			if (Point.Scalar(vector1, vector2) <= 0) {
				return true;
			}
			return false;
		}
	}
}

class Rectangle {
	constructor(min, max) {
		this.min = min;
		this.max = max;
	}
}

class Figure {
	constructor(point) {
		this.points = [];
		this.points[this.points.length] = point;
		this.GetRectangle = function() {
			if (this.points.length != 0) {
				var max = new Point(-99999999999, -99999999999);
				var min = new Point(99999999999, 99999999999);
				for (var i = 0; i < this.points.length; i++) {
					if (max.x < this.points[i].x) {
						max.x = this.points[i].x;
					}
					if (max.y < this.points[i].y) {
						max.y = this.points[i].y;
					}
					if (min.x >= this.points[i].x) {
						min.x = this.points[i].x;
					}
					if (min.y >= this.points[i].y) {
						min.y = this.points[i].y;
					}
				}
				
				return new Rectangle(min, max);
			}
		}
		
		this.GetLines = function() {
			var lines = [];
			if (this.points.length > 1) {
				for (var j = 0; j < this.points.length; j++) {
					if (this.points[j + 1] !== undefined) {
						lines[lines.length] = new Line(this.points[j], this.points[j + 1]);
					}
				}
				lines[lines.length] = new Line(this.points[0], this.points[this.points.length - 1]);
			}
			return lines;
		}
		
		Figure.IsPointInFigure = function(figure, point) {
			if (point !== undefined && figure !== undefined) {
				var l1 = new Line(new Point(Drawer.x1, point.y), new Point(0, point.y + 0.01), false, false);
				var l2 = new Line(new Point(point.x, Drawer.y1), new Point(point.x + 0.01, 0), false, false);
				var l3 = new Line(new Point(0, point.y), new Point(Drawer.x2, point.y + 0.01), false, false);
				var l4 = new Line(new Point(point.x, 0), new Point(point.x + 0.01, Drawer.y2), false, false);
				var lines = figure.GetLines();
				var coutPere1 = 0;
				var coutPere2 = 0;
				var coutPere3 = 0;
				var coutPere4 = 0;
				console.log(lines.length);
				for (var i = 0; i < lines.length; i++) {
					if (Line.GetPointPere(lines[i], l1, true) !== undefined) { coutPere1++; }
					if (Line.GetPointPere(lines[i], l2, true) !== undefined) { coutPere2++; }
					if (Line.GetPointPere(lines[i], l3, true) !== undefined) { coutPere3++; }
					if (Line.GetPointPere(lines[i], l4, true) !== undefined) { coutPere4++; }
					/*coutPere1 += Line.GetPointPere(lines[i], l1, true) == undefined ? 0 : 1;
					coutPere2 += Line.GetPointPere(lines[i], l2, true) == undefined ? 0 : 1;
					coutPere3 += Line.GetPointPere(lines[i], l3, true) == undefined ? 0 : 1;
					coutPere4 += Line.GetPointPere(lines[i], l4, true) == undefined ? 0 : 1;*/
				}
				console.log(coutPere1 + "_" + coutPere2 + "_" + coutPere3 + "_" + coutPere4 + "_");
				var cond = (coutPere1 % 2) == 1 && (coutPere2 % 2) == 1 && coutPere1 != 0 && coutPere2 != 0
					&& (coutPere3 % 2) == 1 && (coutPere4 % 2) == 1 && coutPere3 != 0 && coutPere4 != 0;
				// (cond) {
					if (point == Controller.SelectedPoint) {
						for (var i = 0; i < lines.length; i++) {
							Drawer.DrawPoint(Line.GetPointPere(lines[i], l2, true), "gray");
							Drawer.DrawPoint(Line.GetPointPere(lines[i], l1, true), "gray");
							Drawer.DrawPoint(Line.GetPointPere(lines[i], l3, true), "gray");
							Drawer.DrawPoint(Line.GetPointPere(lines[i], l4, true), "gray");
						}
						
						Drawer.DrawLine(l1, undefined, 0.5);
						//Drawer.DrawLine(l2, undefined, 0.5);
						//Drawer.DrawLine(l3, undefined, 0.5);
						//Drawer.DrawLine(l4, undefined, 0.5);
					}
				//}
				
				return cond;
			}
		}
	}
}

class Bezie {
	constructor(point1, point2, points) {
		this.point1 = point1;
		this.point2 = point2;
		this.points = points;
		this.GetPoints = function() {
			var points = [];
			if (this.points !== undefined) {
				switch (this.points.length) {
					case 0:
						points[points.length] = this.point1;
						points[points.length] = this.point2;
						break;
					case 1:
						for (var i = 0; i < 1; i+= 0.01) {
							points[points.length] = new Point(
								Math.pow((1 - i), 2) * this.point1.x + 2 * i * (1 - i) * this.points[0].x + Math.pow(i, 2) * this.point2.x,
								Math.pow((1 - i), 2) * this.point1.y + 2 * i * (1 - i) * this.points[0].y + Math.pow(i, 2) * this.point2.y
							);
						}
						break;
					case 2:	
						for (var i = 0; i < 1; i+= 0.01) {
							points[points.length] = new Point(
								Math.pow((1 - i), 3) * this.point1.x + 3 * i * Math.pow((1 - i), 2) * this.points[0].x + 2 * Math.pow(i, 2) * (1 - i) * this.points[1].x + Math.pow(i, 3) * this.point2.x,
								Math.pow((1 - i), 3) * this.point1.y + 3 * i * Math.pow((1 - i), 2) * this.points[0].y + 2 * Math.pow(i, 2) * (1 - i) * this.points[1].y + Math.pow(i, 3) * this.point2.y
							);
						}
						break;
				}
			}
			
			return points;
		}
		
		this.GetRectangle = function() {
			var points = this.GetPoints();
			if (points.length != 0) {
				var max = new Point(-99999999999, -99999999999);
				var min = new Point(99999999999, 99999999999);
				for (var i = 0; i < points.length; i++) {
					if (points[i] !== undefined) {
						if (max.x < points[i].x) {
							max.x = points[i].x;
						}
						if (max.y < points[i].y) {
							max.y = points[i].y;
						}
						if (min.x >= points[i].x) {
							min.x = points[i].x;
						}
						if (min.y >= points[i].y) {
							min.y = points[i].y;
						}
					}
				}
				
				return new Rectangle(min, max);
			}
		}
	}
}

/*инициализация статичных методов для Point*/
new Point();

new Line();

/*инициализация статичного класса Drawer*/
new Drawer();

/*инициализация статичного класса Controller*/
new Controller();

new Info();
			
			
			
			
			