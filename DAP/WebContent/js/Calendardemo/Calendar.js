//目的：月历
/*参数：
//  xx. YYYY/MM/DD   VER     AUTHOR      COMMENTS
     1. 2004/08/26   1.00    Michael     New Create
 * ---------------------------------------------------------------------
 */
/** The Calendar object constructor. */
var dateType=0;
var ChinaDateFlg=false;
var FirstOpenFlg=true;
Calendar = function (mondayFirst, dateStr, onSelected, onClose) {
	// member variables
	this.activeDiv = null;
	this.currentDateEl = null;
	this.checkDisabled = null;
	this.timeout = null;
	this.onSelected = onSelected || null;
	this.onClose = onClose || null;
	this.dragging = false;
	this.hidden = false;
	this.minYear = 1970;
	this.maxYear = 2050;
	this.dateFormat = 	
	this.ttDateFormat = Calendar._TT["TT_DATE_FORMAT"];
	this.isPopup = true;
	this.weekNumbers = true;
	this.mondayFirst = mondayFirst;
	this.dateStr = dateStr;
	this.ar_days = null;
	// HTML elements
	this.table = null;
	this.element = null;
	this.tbody = null;
	this.firstdayname = null;
	// Combo boxes
	this.monthsCombo = null;
	this.yearsCombo = null;
	this.hilitedMonth = null;
	this.activeMonth = null;
	this.hilitedYear = null;
	this.activeYear = null;

	// one-time initializations
	if (!Calendar._DN3) {
		// table of short day names
		var ar = new Array();
		for (var i = 8; i > 0;) {
			ar[--i] = Calendar._DN[i].substr(0, 3);
		}
		Calendar._DN3 = ar;
		// table of short month names
		ar = new Array();
		for (var i = 12; i > 0;) {
			ar[--i] = Calendar._MN[i].substr(0, 3);
		}
		Calendar._MN3 = ar;
	}
};

// ** constants

/// "static", needed for event handlers.
Calendar._C = null;

/// detect a special case of "web browser"
Calendar.is_ie = ( (navigator.userAgent.toLowerCase().indexOf("msie") != -1) &&
		   (navigator.userAgent.toLowerCase().indexOf("opera") == -1) );

// short day names array (initialized at first constructor call)
Calendar._DN3 = null;

// short month names array (initialized at first constructor call)
Calendar._MN3 = null;

// BEGIN: UTILITY FUNCTIONS; beware that these might be moved into a separate
//        library, at some point.

Calendar.getAbsolutePos = function(el) {
	var r = { x: el.offsetLeft, y: el.offsetTop };
	if (el.offsetParent) {
		var tmp = Calendar.getAbsolutePos(el.offsetParent);
		r.x += tmp.x;
		r.y += tmp.y;
	}

	return r;
};

Calendar.isRelated = function (el, evt) {
	var related = evt.relatedTarget;
	if (!related) {
		var type = evt.type;
		if (type == "mouseover") {
			related = evt.fromElement;
		} else if (type == "mouseout") {
			related = evt.toElement;
		}
	}
	while (related) {
		if (related == el) {
			return true;
		}
		related = related.parentNode;
	}
	return false;
};

Calendar.removeClass = function(el, className) {
	if (!(el && el.className)) {
		return;
	}
	var cls = el.className.split(" ");
	var ar = new Array();
	for (var i = cls.length; i > 0;) {
		if (cls[--i] != className) {
			ar[ar.length] = cls[i];
		}
	}
	el.className = ar.join(" ");
};

Calendar.addClass = function(el, className) {
	Calendar.removeClass(el, className);
	el.className += " " + className;
};

Calendar.getElement = function(ev) {
	if (Calendar.is_ie) {
		return window.event.srcElement;
	} else {
		return ev.currentTarget;
	}
};

Calendar.getTargetElement = function(ev) {
	if (Calendar.is_ie) {
		return window.event.srcElement;
	} else {
		return ev.target;
	}
};

Calendar.stopEvent = function(ev) {
	if (Calendar.is_ie) {
		window.event.cancelBubble = true;
		window.event.returnValue = false;
	} else {
		ev.preventDefault();
		ev.stopPropagation();
	}
};

Calendar.addEvent = function(el, evname, func) {
	if (Calendar.is_ie) {
		el.attachEvent("on" + evname, func);
	} else {
		el.addEventListener(evname, func, true);
	}
};

Calendar.removeEvent = function(el, evname, func) {
	if (Calendar.is_ie) {
		el.detachEvent("on" + evname, func);
	} else {
		el.removeEventListener(evname, func, true);
	}
};

Calendar.createElement = function(type, parent) {
	var el = null;
	if (document.createElementNS) {
		el = document.createElementNS("", type);
	} else {
		el = document.createElement(type);
	}
	if (typeof parent != "undefined") {
		parent.appendChild(el);
	}
	return el;
};

Calendar._add_evs = function(el) {
	with (Calendar) {
		addEvent(el, "mouseover", dayMouseOver);
		addEvent(el, "mousedown", dayMouseDown);
		addEvent(el, "mouseout", dayMouseOut);
		if (is_ie) {
			addEvent(el, "dblclick", dayMouseDblClick);
			el.setAttribute("unselectable", true);
		}
	}
};

Calendar.findMonth = function(el) {
	if (typeof el.month != "undefined") {
		return el;
	} else if (typeof el.parentNode.month != "undefined") {
		return el.parentNode;
	}
	return null;
};

Calendar.findYear = function(el) {
	if (typeof el.year != "undefined") {
		return el;
	} else if (typeof el.parentNode.year != "undefined") {
		return el.parentNode;
	}
	return null;
};

Calendar.showMonthsCombo = function () {
	var cal = Calendar._C;
	if (!cal) {
		return false;
	}
	var cal = cal;
	var cd = cal.activeDiv;
	var mc = cal.monthsCombo;
	if (cal.hilitedMonth) {
		Calendar.removeClass(cal.hilitedMonth, "hilite");
	}
	if (cal.activeMonth) {
		Calendar.removeClass(cal.activeMonth, "active");
	}
	var mon = cal.monthsCombo.getElementsByTagName("div")[cal.date.getMonth()];
	Calendar.addClass(mon, "active");
	cal.activeMonth = mon;
	mc.style.left = cd.offsetLeft + "px";
	mc.style.top = (cd.offsetTop + cd.offsetHeight) + "px";
	mc.style.display = "block";
};

Calendar.showYearsCombo = function (fwd) {
	var cal = Calendar._C;
	if (!cal) {
		return false;
	}
	var cal = cal;
	var cd = cal.activeDiv;
	var yc = cal.yearsCombo;
	if (cal.hilitedYear) {
		Calendar.removeClass(cal.hilitedYear, "hilite");
	}
	if (cal.activeYear) {
		Calendar.removeClass(cal.activeYear, "active");
	}
	cal.activeYear = null;
	var Y = cal.date.getFullYear() + (fwd ? 1 : -1);
	var yr = yc.firstChild;
	var show = false;
	for (var i = 12; i > 0; --i) {
		if (Y >= cal.minYear && Y <= cal.maxYear) {
			yr.firstChild.data = Y;
			yr.year = Y;
			yr.style.display = "block";
			show = true;
		} else {
			yr.style.display = "none";
		}
		yr = yr.nextSibling;
		Y += fwd ? 2 : -2;
	}
	if (show) {
		yc.style.left = cd.offsetLeft + "px";
		yc.style.top = (cd.offsetTop + cd.offsetHeight) + "px";
		yc.style.display = "block";
	}
};

// event handlers

Calendar.tableMouseUp = function(ev) {

	var cal = Calendar._C;
	if (!cal) {
		return false;
	}
	if (cal.timeout) {
		clearTimeout(cal.timeout);
	}
	var el = cal.activeDiv;
	if (!el) {
		return false;
	}
	var target = Calendar.getTargetElement(ev);

	Calendar.removeClass(el, "active");
	if (target == el || target.parentNode == el) {
		Calendar.cellClick(el);
	}
	var mon = Calendar.findMonth(target);
	var date = null;
	if (mon) {
		date = new Date(cal.date);
		if (mon.month != date.getMonth()) {
			date.setMonth(mon.month);
			cal.setDate(date);
		}
	} else {
		var year = Calendar.findYear(target);
		if (year) {
			date = new Date(cal.date);
			if (year.year != date.getFullYear()) {
				date.setFullYear(year.year);
				cal.setDate(date);
			}
		}
	}
	with (Calendar) {
		removeEvent(document, "mouseup", tableMouseUp);
		removeEvent(document, "mouseover", tableMouseOver);
		removeEvent(document, "mousemove", tableMouseOver);
		cal._hideCombos();
		stopEvent(ev);
		_C = null;
	}
};

Calendar.tableMouseOver = function (ev) {
	var cal = Calendar._C;
	if (!cal) {
		return;
	}
	var el = cal.activeDiv;
	var target = Calendar.getTargetElement(ev);
	if (target == el || target.parentNode == el) {
		Calendar.addClass(el, "hilite active");
		Calendar.addClass(el.parentNode, "rowhilite");
	} else {
		Calendar.removeClass(el, "active");
		Calendar.removeClass(el, "hilite");
		Calendar.removeClass(el.parentNode, "rowhilite");
	}
	var mon = Calendar.findMonth(target);
	if (mon) {
		if (mon.month != cal.date.getMonth()) {
			if (cal.hilitedMonth) {
				Calendar.removeClass(cal.hilitedMonth, "hilite");
			}
			Calendar.addClass(mon, "hilite");
			cal.hilitedMonth = mon;
		} else if (cal.hilitedMonth) {
			Calendar.removeClass(cal.hilitedMonth, "hilite");
		}
	} else {
		var year = Calendar.findYear(target);
		if (year) {
			if (year.year != cal.date.getFullYear()) {
				if (cal.hilitedYear) {
					Calendar.removeClass(cal.hilitedYear, "hilite");
				}
				Calendar.addClass(year, "hilite");
				cal.hilitedYear = year;
			} else if (cal.hilitedYear) {
				Calendar.removeClass(cal.hilitedYear, "hilite");
			}
		}
	}
	Calendar.stopEvent(ev);
};

Calendar.tableMouseDown = function (ev) {
	if (Calendar.getTargetElement(ev) == Calendar.getElement(ev)) {
		Calendar.stopEvent(ev);
	}
};

Calendar.calDragIt = function (ev) {
	var cal = Calendar._C;
	if (!(cal && cal.dragging)) {
		return false;
	}
	var posX;
	var posY;
	if (Calendar.is_ie) {
		posY = window.event.clientY + document.body.scrollTop;
		posX = window.event.clientX + document.body.scrollLeft;
	} else {
		posX = ev.pageX;
		posY = ev.pageY;
	}
	cal.hideShowCovered();
	var st = cal.element.style;
	st.left = (posX - cal.xOffs) + "px";
	st.top = (posY - cal.yOffs) + "px";
	Calendar.stopEvent(ev);
};

Calendar.calDragEnd = function (ev) {
	var cal = Calendar._C;
	if (!cal) {
		return false;
	}
	cal.dragging = false;
	with (Calendar) {
		removeEvent(document, "mousemove", calDragIt);
		removeEvent(document, "mouseover", stopEvent);
		removeEvent(document, "mouseup", calDragEnd);
		tableMouseUp(ev);
	}
	cal.hideShowCovered();
};

Calendar.dayMouseDown = function(ev) {

	var el = Calendar.getElement(ev);
	if (el.disabled) {
		return false;
	}
	var cal = el.calendar;
	cal.activeDiv = el;
	Calendar._C = cal;
	if (el.navtype != 300) with (Calendar) {
		addClass(el, "hilite active");
		addEvent(document, "mouseover", tableMouseOver);
		addEvent(document, "mousemove", tableMouseOver);
		addEvent(document, "mouseup", tableMouseUp);
	} else if (cal.isPopup) {
		cal._dragStart(ev);
	}
	Calendar.stopEvent(ev);
	if (el.navtype == -1 || el.navtype == 1) {
		cal.timeout = setTimeout("Calendar.showMonthsCombo()", 250);
	} else if (el.navtype == -2 || el.navtype == 2) {
		cal.timeout = setTimeout((el.navtype > 0) ? "Calendar.showYearsCombo(true)" : "Calendar.showYearsCombo(false)", 250);
	} else {
		cal.timeout = null;
	}
};

Calendar.dayMouseDblClick = function(ev) {
	Calendar.cellClick(Calendar.getElement(ev));
	if (Calendar.is_ie) {
		try{
			document.selection.empty();
		}
		catch (exp)	{}	
	}
};

Calendar.dayMouseOver = function(ev) {
	var el = Calendar.getElement(ev);
	if (Calendar.isRelated(el, ev) || Calendar._C || el.disabled) {
		return false;
	}
	if (el.ttip) {
		if (el.ttip.substr(0, 1) == "_") {
			var date = null;
			with (el.calendar.date) {
				date = new Date(getFullYear(), getMonth(), el.caldate);
			}
			el.ttip = date.print(el.calendar.ttDateFormat) + el.ttip.substr(1);
		}
		el.calendar.tooltips.firstChild.data = el.ttip;
	}
	if (el.navtype != 300) {
		Calendar.addClass(el, "hilite");
		if (el.caldate) {
			Calendar.addClass(el.parentNode, "rowhilite");
		}
	}
	Calendar.stopEvent(ev);
};

Calendar.dayMouseOut = function(ev) {
	with (Calendar) {
		var el = getElement(ev);
		if (isRelated(el, ev) || _C || el.disabled) {
			return false;
		}
		removeClass(el, "hilite");
		if (el.caldate) {
			removeClass(el.parentNode, "rowhilite");
		}
		el.calendar.tooltips.firstChild.data = _TT["SEL_DATE"];

		stopEvent(ev);
	}
};

/**
 *  A generic "click" handler :) handles all types of buttons defined in this
 *  calendar.
 */
Calendar.cellClick = function(el) {
	var cal = el.calendar;
	var closing = false;
	var newdate = false;
	var date = null;
	if (typeof el.navtype == "undefined") {
		Calendar.removeClass(cal.currentDateEl, "selected");
		Calendar.addClass(el, "selected");
		closing = (cal.currentDateEl == el);
		if (!closing) {
			cal.currentDateEl = el;
		}
		
		cal.date.setDate(el.caldate);
		date = cal.date;
		newdate = true;
	} else {
		if (el.navtype == 200) {
			Calendar.removeClass(el, "hilite");
			cal.callCloseHandler();
			return;
		}
		date = (el.navtype == 0) ? new Date() : new Date(cal.date);
		var year = date.getFullYear();//20051103
		var mon = date.getMonth();
	    

		function setMonth(m) {
			var day = date.getDate();
			var max = date.getMonthDays(m);
			if (day > max) {
				date.setDate(max);
			}
			date.setMonth(m);
		};
		FirstOpenFlg=false;
		switch (el.navtype) {
		    case -2:
				if (year > cal.minYear) {
					date.setFullYear(year - 1);
				}
				break;
		    case -1:
				if (mon > 0) {
					setMonth(mon - 1);
				} else if (year-- > cal.minYear) {
					date.setFullYear(year);
					setMonth(11);
				}
				break;
		    case 1:
				if (mon < 11) {
					setMonth(mon + 1);
				} else if (year < cal.maxYear) {
					date.setFullYear(year + 1);
					setMonth(0);
				}
				break;
		    case 2:
				if (year < cal.maxYear) {
					date.setFullYear(year + 1);
				}
				break;
		    case 100:
				cal.setMondayFirst(!cal.mondayFirst);
			return;
		}
		if (!date.equalsTo(cal.date)) {
			cal.setDate(date);
			newdate = el.navtype == 0;
		}
	}
	if (newdate) {
		cal.callHandler();
	}
	if (closing) {
		Calendar.removeClass(el, "hilite");
		cal.callCloseHandler();
	}
};

// END: CALENDAR STATIC FUNCTIONS

// BEGIN: CALENDAR OBJECT FUNCTIONS

/**
 *  This function creates the calendar inside the given parent.  If _par is
 *  null than it creates a popup calendar inside the BODY element.  If _par is
 *  an element, be it BODY, then it creates a non-popup calendar (still
 *  hidden).  Some properties need to be set before calling this function.
 */
Calendar.prototype.create = function (_par) {
	var parent = null;
	if (! _par) {
		// default parent is the document body, in which case we create
		// a popup calendar.
		parent = document.getElementsByTagName("body")[0];
		this.isPopup = true;
	} else {
		parent = _par;
		this.isPopup = false;
	}
	this.date = this.dateStr ? new Date(this.dateStr) : new Date();

	var table = Calendar.createElement("table");
	this.table = table;
	table.cellSpacing = 0;
	table.cellPadding = 0;
	table.calendar = this;
	Calendar.addEvent(table, "mousedown", Calendar.tableMouseDown);

	var div = Calendar.createElement("div");
	this.element = div;
	div.className = "calendar";
	if (this.isPopup) {
		div.style.position = "absolute";
		div.style.display = "none";
	}
	div.appendChild(table);

	var thead = Calendar.createElement("thead", table);
	var cell = null;
	var row = null;

	var cal = this;
	var hh = function (text, cs, navtype) {
		cell = Calendar.createElement("td", row);
		cell.colSpan = cs;
		cell.className = "button";
		Calendar._add_evs(cell);
		cell.calendar = cal;
		cell.navtype = navtype;
		if (text.substr(0, 1) != "&") {
			cell.appendChild(document.createTextNode(text));
		}
		else {
			// FIXME: dirty hack for entities
			cell.innerHTML = text;
		}
		return cell;
	};

	row = Calendar.createElement("tr", thead);
	var title_length = 6;
	(this.isPopup) && --title_length;
	(this.weekNumbers) && ++title_length;

	hh("-", 1, 100).ttip = Calendar._TT["TOGGLE"];
	this.title = hh("", title_length, 300);
	this.title.className = "title";
	if (this.isPopup) {
		this.title.ttip = Calendar._TT["DRAG_TO_MOVE"];
		this.title.style.cursor = "move";
		hh("&#x00d7;", 1, 200).ttip = Calendar._TT["CLOSE"];
	}

	row = Calendar.createElement("tr", thead);
	row.className = "headrow";

	this._nav_py = hh("&#x00ab;", 1, -2);
	this._nav_py.ttip = Calendar._TT["PREV_YEAR"];

	this._nav_pm = hh("&#x2039;", 1, -1);
	this._nav_pm.ttip = Calendar._TT["PREV_MONTH"];

	this._nav_now = hh(Calendar._TT["TODAY"], this.weekNumbers ? 4 : 3, 0);
	this._nav_now.ttip = Calendar._TT["GO_TODAY"];

	this._nav_nm = hh("&#x203a;", 1, 1);
	this._nav_nm.ttip = Calendar._TT["NEXT_MONTH"];

	this._nav_ny = hh("&#x00bb;", 1, 2);
	this._nav_ny.ttip = Calendar._TT["NEXT_YEAR"]

	// day names
	row = Calendar.createElement("tr", thead);
	row.className = "daynames";
	if (this.weekNumbers) {
		cell = Calendar.createElement("td", row);
		cell.className = "name wn";
		cell.appendChild(document.createTextNode(Calendar._TT["WK"]));
	}
	for (var i = 7; i > 0; --i) {
		cell = Calendar.createElement("td", row);
		cell.appendChild(document.createTextNode(""));
		if (!i) {
			cell.navtype = 100;
			cell.calendar = this;
			Calendar._add_evs(cell);
		}
	}
	this.firstdayname = (this.weekNumbers) ? row.firstChild.nextSibling : row.firstChild;
	this._displayWeekdays();

	var tbody = Calendar.createElement("tbody", table);
	this.tbody = tbody;

	for (i = 6; i > 0; --i) {
		row = Calendar.createElement("tr", tbody);
		if (this.weekNumbers) {
			cell = Calendar.createElement("td", row);
			cell.appendChild(document.createTextNode(""));
		}
		for (var j = 7; j > 0; --j) {
			cell = Calendar.createElement("td", row);
			cell.appendChild(document.createTextNode(""));
			cell.calendar = this;
			Calendar._add_evs(cell);
		}
	}

	var tfoot = Calendar.createElement("tfoot", table);

	row = Calendar.createElement("tr", tfoot);
	row.className = "footrow";

	cell = hh(Calendar._TT["SEL_DATE"], this.weekNumbers ? 8 : 7, 300);

	cell.className = "ttip";
	if (this.isPopup) {
		cell.ttip = Calendar._TT["DRAG_TO_MOVE"];
		cell.style.cursor = "move";
	}
	this.tooltips = cell;

	div = Calendar.createElement("div", this.element);
	this.monthsCombo = div;
	div.className = "combo";
	for (i = 0; i < Calendar._MN.length; ++i) {
		var mn = Calendar.createElement("div");
		mn.className = "label";
		mn.month = i;
		mn.appendChild(document.createTextNode(Calendar._MN3[i]));
		div.appendChild(mn);
	}

	div = Calendar.createElement("div", this.element);
	this.yearsCombo = div;
	div.className = "combo";
	for (i = 12; i > 0; --i) {
		var yr = Calendar.createElement("div");
		yr.className = "label";
		yr.appendChild(document.createTextNode(""));
		div.appendChild(yr);
	}

	this._init(this.mondayFirst, this.date);
	parent.appendChild(this.element);
};

/** keyboard navigation, only for popup calendars */
Calendar._keyEvent = function(ev) {
	if (!window.calendar) {
		return false;
	}
	(Calendar.is_ie) && (ev = window.event);
	var cal = window.calendar;
	var act = (Calendar.is_ie || ev.type == "keypress");
	if (ev.ctrlKey) {
		switch (ev.keyCode) {
		    case 37: // KEY left
			act && Calendar.cellClick(cal._nav_pm);
			break;
		    case 38: // KEY up
			act && Calendar.cellClick(cal._nav_py);
			break;
		    case 39: // KEY right
			act && Calendar.cellClick(cal._nav_nm);
			break;
		    case 40: // KEY down
			act && Calendar.cellClick(cal._nav_ny);
			break;
		    default:
			return false;
		}
	} else switch (ev.keyCode) {
	    case 32: // KEY space (now)
		Calendar.cellClick(cal._nav_now);
		break;
	    case 27: // KEY esc
		act && cal.hide();
		break;
	    case 37: // KEY left
	    case 38: // KEY up
	    case 39: // KEY right
	    case 40: // KEY down
		if (act) {
			var date = cal.date.getDate() - 1;
			var el = cal.currentDateEl;
			var ne = null;
			var prev = (ev.keyCode == 37) || (ev.keyCode == 38);
			switch (ev.keyCode) {
			    case 37: // KEY left
				(--date >= 0) && (ne = cal.ar_days[date]);
				break;
			    case 38: // KEY up
				date -= 7;
				(date >= 0) && (ne = cal.ar_days[date]);
				break;
			    case 39: // KEY right
				(++date < cal.ar_days.length) && (ne = cal.ar_days[date]);
				break;
			    case 40: // KEY down
				date += 7;
				(date < cal.ar_days.length) && (ne = cal.ar_days[date]);
				break;
			}
			if (!ne) {
				if (prev) {
					Calendar.cellClick(cal._nav_pm);
				} else {
					Calendar.cellClick(cal._nav_nm);
				}
				date = (prev) ? cal.date.getMonthDays() : 1;
				el = cal.currentDateEl;
				ne = cal.ar_days[date - 1];
			}
			Calendar.removeClass(el, "selected");
			Calendar.addClass(ne, "selected");
			cal.date.setDate(ne.caldate);
			cal.currentDateEl = ne;
		}
		break;
	    case 13: // KEY enter
		if (act) {
			cal.callHandler();
			cal.hide();
		}
		break;
	    default:
		return false;
	}
	Calendar.stopEvent(ev);
};

/**
 *  (RE)Initializes the calendar to the given date and style (if mondayFirst is
 *  true it makes Monday the first day of week, otherwise the weeks start on
 *  Sunday.
 */
Calendar.prototype._init = function (mondayFirst, date) {
	var today = new Date();
	var year = date.getFullYear();
	if (year < this.minYear) {
		year = this.minYear;
		date.setFullYear(year);
	} else if (year > this.maxYear) {
		year = this.maxYear;
		date.setFullYear(year);
	}
	this.mondayFirst = mondayFirst;
	this.date = new Date(date);
	var month = date.getMonth();
	var mday = date.getDate();
	var no_days = date.getMonthDays();
	date.setDate(1);
	var wday = date.getDay();
	var MON = mondayFirst ? 1 : 0;
	var SAT = mondayFirst ? 5 : 6;
	var SUN = mondayFirst ? 6 : 0;
	if (mondayFirst) {
		wday = (wday > 0) ? (wday - 1) : 6;
	}
	var iday = 1;
	var row = this.tbody.firstChild;
	var MN = Calendar._MN3[month];
	var hasToday = ((today.getFullYear() == year) && (today.getMonth() == month));
	var todayDate = today.getDate();
	var week_number = date.getWeekNumber();
	var ar_days = new Array();
	for (var i = 0; i < 6; ++i) {
		if (iday > no_days) {
			row.className = "emptyrow";
			row = row.nextSibling;
			continue;
		}
		var cell = row.firstChild;
		if (this.weekNumbers) {
			cell.className = "day wn";
			cell.firstChild.data = week_number;
			cell = cell.nextSibling;
		}
		++week_number;
		row.className = "daysrow";
		for (var j = 0; j < 7; ++j) {
			cell.className = "day";
			if ((!i && j < wday) || iday > no_days) {
				// cell.className = "emptycell";
				cell.innerHTML = "&nbsp;";
				cell.disabled = true;
				cell = cell.nextSibling;
				continue;
			}
			cell.disabled = false;
			cell.firstChild.data = iday;
			if (typeof this.checkDisabled == "function") {
				date.setDate(iday);
				if (this.checkDisabled(date)) {
					cell.className += " disabled";
					cell.disabled = true;
				}
			}
			if (!cell.disabled) {
				ar_days[ar_days.length] = cell;
				cell.caldate = iday;
				cell.ttip = "_";
				if (iday == mday) {
					cell.className += " selected";
					this.currentDateEl = cell;
				}
				if (hasToday && (iday == todayDate)) {
					cell.className += " today";
					cell.ttip += Calendar._TT["PART_TODAY"];
				}
				if (wday == SAT || wday == SUN) {
					cell.className += " weekend";
				}
			}
			++iday;
			((++wday) ^ 7) || (wday = 0);
			cell = cell.nextSibling;
		}
		row = row.nextSibling;
	}
	this.ar_days = ar_days;
	//此处做一些判断
	if(!ChinaDateFlg)
		this.title.firstChild.data = Calendar._MN[month] + ", " +year;
	else
		this.title.firstChild.data = Calendar._MN[month] + ", 民国" + (year-1911);
		//noClickFlg=false;
	// PROFILE
	// this.tooltips.firstChild.data = "Generated in " + ((new Date()) - today) + " ms";
};

/**
 *  Calls _init function above for going to a certain date (but only if the
 *  date is different than the currently selected one).
 */
Calendar.prototype.setDate = function (date) {
	if (!date.equalsTo(this.date)) {
		if(!ChinaDateFlg)
			this._init(this.mondayFirst, date);
		else
		{
			if(FirstOpenFlg)
			{
				date.setYear(date.getFullYear()+11);
				FirstOpenFlg=false;
			}
			this._init(this.mondayFirst, date);
		}
	}
};

/** Modifies the "mondayFirst" parameter (EU/US style). */

Calendar.prototype.setMondayFirst = function (mondayFirst) {
	this._init(mondayFirst, this.date);
	this._displayWeekdays();
};

/**
 *  Allows customization of what dates are enabled.  The "unaryFunction"
 *  parameter must be a function object that receives the date (as a JS Date
 *  object) and returns a boolean value.  If the returned value is true then
 *  the passed date will be marked as disabled.
 */
Calendar.prototype.setDisabledHandler = function (unaryFunction) {
	this.checkDisabled = unaryFunction;
};

/** Customization of allowed year range for the calendar. */
Calendar.prototype.setRange = function (a, z) {
	this.minYear = a;
	this.maxYear = z;
};

/** Calls the first user handler (selectedHandler). */
Calendar.prototype.callHandler = function () {
	if (this.onSelected) {
		if(!ChinaDateFlg)
			this.onSelected(this, this.date.print(this.dateFormat));		
		else
		{
			var strD=(this.date.getFullYear()-1911)+"/"+(this.date.getMonth()+1)+"/"+this.date.getDate();
			this.onSelected(this, strD);
		}
	}
};

/** Calls the second user handler (closeHandler). */
Calendar.prototype.callCloseHandler = function () {
	if (this.onClose) {
		FirstOpenFlg=true;
		this.onClose(this);
	}
	this.hideShowCovered();
};

/** Removes the calendar object from the DOM tree and destroys it. */
Calendar.prototype.destroy = function () {
	var el = this.element.parentNode;
	el.removeChild(this.element);
	Calendar._C = null;
	delete el;
};

/**
 *  Moves the calendar element to a different section in the DOM tree (changes
 *  its parent).
 */
Calendar.prototype.reparent = function (new_parent) {
	var el = this.element;
	el.parentNode.removeChild(el);
	new_parent.appendChild(el);
};

// This gets called when the user presses a mouse button anywhere in the
// document, if the calendar is shown.  If the click was outside the open
// calendar this function closes it.
Calendar._checkCalendar = function(ev) {
	if (!window.calendar) {
		return false;
	}
	var el = Calendar.is_ie ? Calendar.getElement(ev) : Calendar.getTargetElement(ev);
	for (; el != null && el != calendar.element; el = el.parentNode);
	if (el == null) {
		// calls closeHandler which should hide the calendar.
		window.calendar.callCloseHandler();
		Calendar.stopEvent(ev);
	}
};

/** Shows the calendar. */
Calendar.prototype.show = function () {
	var rows = this.table.getElementsByTagName("tr");
	for (var i = rows.length; i > 0;) {
		var row = rows[--i];
		Calendar.removeClass(row, "rowhilite");
		var cells = row.getElementsByTagName("td");
		for (var j = cells.length; j > 0;) {
			var cell = cells[--j];
			Calendar.removeClass(cell, "hilite");
			Calendar.removeClass(cell, "active");
		}
	}
	this.table.width = '150px';
	this.table.height = '150px';
	this.element.style.display = "block";
	this.hidden = false;
	if (this.isPopup) {
		window.calendar = this;
		Calendar.addEvent(document, "keydown", Calendar._keyEvent);
		Calendar.addEvent(document, "keypress", Calendar._keyEvent);
		Calendar.addEvent(document, "mousedown", Calendar._checkCalendar);
	}
	this.hideShowCovered();
};

/**
 *  Hides the calendar.  Also removes any "hilite" from the class of any TD
 *  element.
 */
Calendar.prototype.hide = function () {
	if (this.isPopup) {
		Calendar.removeEvent(document, "keydown", Calendar._keyEvent);
		Calendar.removeEvent(document, "keypress", Calendar._keyEvent);
		Calendar.removeEvent(document, "mousedown", Calendar._checkCalendar);
	}
	this.element.style.display = "none";
	this.hidden = true;
	this.hideShowCovered();
};

/**
 *  Shows the calendar at a given absolute position (beware that, depending on
 *  the calendar element style -- position property -- this might be relative
 *  to the parent's containing rectangle).
 */
Calendar.prototype.showAt = function (x, y) {
	var s = this.element.style;
	s.left = x + "px";
	s.top = y + "px";
	this.show();
};

/** Shows the calendar near a given element. */
Calendar.prototype.showAtElement = function (el) {
	var p = Calendar.getAbsolutePos(el);

   //Modify By Joe 2003/11/11
   //避免小月历的位置跑到画面外, 所以多加判断scroll的位子
   //this.showAt(p.x, p.y + el.offsetHeight);
   
	if (p.y + el.offsetHeight + 170 > document.body.scrollHeight && document.body.scrollHeight > 600 ){
	   this.showAt(p.x, p.y - el.offsetHeight - 170);
	}else{
	   this.showAt(p.x, p.y + el.offsetHeight);
	}
	
	//Modify By Joe 2003/11/11 End
	
};

/** Customizes the date format. */
Calendar.prototype.setDateFormat = function (str) {
	this.dateFormat = str;
};

/** Customizes the tooltip date format. */
Calendar.prototype.setTtDateFormat = function (str) {
	this.ttDateFormat = str;
};

/**
 *  Tries to identify the date represented in a string.  If successful it also
 *  calls this.setDate which moves the calendar to the given date.
 */
Calendar.prototype.parseDate = function (str, fmt) {
	var y = 0;
	var m = -1;
	var d = 0;
	var a = str.split(/\W+/);
	if (!fmt) {
		fmt = this.dateFormat;
	}
	var b = fmt.split(/\W+/);
	var i = 0, j = 0;
	for (i = 0; i < a.length; ++i) {
		if (b[i] == "D" || b[i] == "DD") {
			continue;
		}
		if (b[i] == "d" || b[i] == "dd") {
			d = parseInt(a[i]);
		}
		if (b[i] == "m" || b[i] == "mm") {
			m = parseInt(a[i]) - 1;
		}
		if (b[i] == "y") {
			y = parseInt(a[i]);
		}
		if (b[i] == "yy") {
			y = parseInt(a[i]) + 1900;
		}
		if (b[i] == "M" || b[i] == "MM") {
			for (j = 0; j < 12; ++j) {
				if (Calendar._MN[j].substr(0, a[i].length).toLowerCase() == a[i].toLowerCase()) { m = j; break; }
			}
		}
	}
	if (y != 0 && m != -1 && d != 0) {
		this.setDate(new Date(y, m, d));
		return;
	}
	y = 0; m = -1; d = 0;
	for (i = 0; i < a.length; ++i) {
		if (a[i].search(/[a-zA-Z]+/) != -1) {
			var t = -1;
			for (j = 0; j < 12; ++j) {
				if (Calendar._MN[j].substr(0, a[i].length).toLowerCase() == a[i].toLowerCase()) { t = j; break; }
			}
			if (t != -1) {
				if (m != -1) {
					d = m+1;
				}
				m = t;
			}
		} else if (parseInt(a[i]) <= 12 && m == -1) {
			m = a[i]-1;
		} else if (parseInt(a[i]) > 31 && y == 0) {
			y = a[i];
		} else if (d == 0) {
			d = a[i];
		}
	}
	if (y == 0) {
		var today = new Date();
		y = today.getFullYear();
	}
	if (m != -1 && d != 0) {
		this.setDate(new Date(y, m, d));
	}
};

Calendar.prototype.hideShowCovered = function () {
	var tags = new Array("applet", "iframe", "select");
	var el = this.element;

	var p = Calendar.getAbsolutePos(el);
	var EX1 = p.x;
	var EX2 = el.offsetWidth + EX1;
	var EY1 = p.y;
	var EY2 = el.offsetHeight + EY1;

	for (var k = tags.length; k > 0; ) {
		var ar = document.getElementsByTagName(tags[--k]);
		var cc = null;

		for (var i = ar.length; i > 0;) {
			cc = ar[--i];

			p = Calendar.getAbsolutePos(cc);
			var CX1 = p.x;
			var CX2 = cc.offsetWidth + CX1;
			var CY1 = p.y;
			var CY2 = cc.offsetHeight + CY1;

			if (this.hidden || (CX1 > EX2) || (CX2 < EX1) || (CY1 > EY2) || (CY2 < EY1)) {
				cc.style.visibility = "visible";
			} else {
				cc.style.visibility = "hidden";
			}
		}
	}
};

/** Internal function; it displays the bar with the names of the weekday. */
Calendar.prototype._displayWeekdays = function () {
	var MON = this.mondayFirst ? 0 : 1;
	var SUN = this.mondayFirst ? 6 : 0;
	var SAT = this.mondayFirst ? 5 : 6;
	var cell = this.firstdayname;
	for (var i = 0; i < 7; ++i) {
		cell.className = "day name";
		if (!i) {
			cell.ttip = this.mondayFirst ? Calendar._TT["SUN_FIRST"] : Calendar._TT["MON_FIRST"];
			cell.navtype = 100;
			cell.calendar = this;
			Calendar._add_evs(cell);
		}
		if (i == SUN || i == SAT) {
			Calendar.addClass(cell, "weekend");
		}
		cell.firstChild.data = Calendar._DN3[i + 1 - MON];
		cell = cell.nextSibling;
	}
};

/** Internal function.  Hides all combo boxes that might be displayed. */
Calendar.prototype._hideCombos = function () {
	this.monthsCombo.style.display = "none";
	this.yearsCombo.style.display = "none";
};

/** Internal function.  Starts dragging the element. */
Calendar.prototype._dragStart = function (ev) {
	if (this.dragging) {
		return;
	}
	this.dragging = true;
	var posX;
	var posY;
	if (Calendar.is_ie) {
		posY = window.event.clientY + document.body.scrollTop;
		posX = window.event.clientX + document.body.scrollLeft;
	} else {
		posY = ev.clientY + window.scrollY;
		posX = ev.clientX + window.scrollX;
	}
	var st = this.element.style;
	this.xOffs = posX - parseInt(st.left);
	this.yOffs = posY - parseInt(st.top);
	with (Calendar) {
		addEvent(document, "mousemove", calDragIt);
		addEvent(document, "mouseover", stopEvent);
		addEvent(document, "mouseup", calDragEnd);
	}
};

// BEGIN: DATE OBJECT PATCHES

/** Adds the number of days array to the Date object. */
Date._MD = new Array(31,28,31,30,31,30,31,31,30,31,30,31);

/** Constants used for time computations */
Date.SECOND = 1000 /* milliseconds */;
Date.MINUTE = 60 * Date.SECOND;
Date.HOUR   = 60 * Date.MINUTE;
Date.DAY    = 24 * Date.HOUR;
Date.WEEK   =  7 * Date.DAY;

/** Returns the number of days in the current month */
Date.prototype.getMonthDays = function(month) {
	var year = this.getFullYear();
	if (typeof month == "undefined") {
		month = this.getMonth();
	}
	if (((0 == (year%4)) && ( (0 != (year%100)) || (0 == (year%400)))) && month == 1) {
		return 29;
	} else {
		return Date._MD[month];
	}
};

/** Returns the number of the week.  The algorithm was "stolen" from PPK's
 * website, hope it's correct :) http://www.xs4all.nl/~ppk/js/week.html */
Date.prototype.getWeekNumber = function() {
	var now = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
	var then = new Date(this.getFullYear(), 0, 1, 0, 0, 0);
	var time = now - then;
	var day = then.getDay();
	(day > 3) && (day -= 4) || (day += 3);
	return Math.round(((time / Date.DAY) + day) / 7);
};

/** Checks dates equality (ignores time) */
Date.prototype.equalsTo = function(date) {
	return ((this.getFullYear() == date.getFullYear()) &&
		(this.getMonth() == date.getMonth()) &&
		(this.getDate() == date.getDate()));
};

/** Prints the date in a string according to the given format. */
Date.prototype.print = function (frm) {
	var str = new String(frm);
	var m = this.getMonth();
	var d = this.getDate();
	var y = this.getFullYear();
	var wn = this.getWeekNumber();
	var w = this.getDay();
	var s = new Array();
	s["d"] = d;
	s["dd"] = (d < 10) ? ("0" + d) : d;
	s["m"] = 1+m;
	s["mm"] = (m < 9) ? ("0" + (1+m)) : (1+m);
	s["y"] = y;
	s["yy"] = new String(y).substr(2, 2);
	s["w"] = wn;
	s["ww"] = (wn < 10) ? ("0" + wn) : wn;
	with (Calendar) {
		s["D"] = _DN3[w];
		s["DD"] = _DN[w];
		s["M"] = _MN3[m];
		s["MM"] = _MN[m];
	}
	var re = /(.*)(\W|^)(d|dd|m|mm|y|yy|MM|M|DD|D|w|ww)(\W|$)(.*)/;
	while (re.exec(str) != null) {
		str = RegExp.$1 + RegExp.$2 + s[RegExp.$3] + RegExp.$4 + RegExp.$5;
	}
	return str;
};

// END: DATE OBJECT PATCHES
// global object that remembers the calendar
window.calendar = null;

//********calendar-1.js
var oldLink = null;
// code to change the active stylesheet
function setActiveStyleSheet(link, title) {
  var i, a, main;
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
      a.disabled = true;
      if(a.getAttribute("title") == title) a.disabled = false;
    }
  }
  if (oldLink) oldLink.style.fontWeight = 'normal';
  oldLink = link;
  link.style.fontWeight = 'bold';
  return false;
}

// This function gets called when the end-user clicks on some date.
function selected(cal, date) {
	
  cal.sel.value = date; // just update the date in the input field.
  gChangeDate(cal.sel,dateType);
    // if we add this call we close the calendar on single-click.
    // just to exemplify both cases, we are using this only for the 1st
    // and the 3rd field, while 2nd and 4th will still require double-click.
  if (cal.sel.id == "sel1" || cal.sel.id == "sel3")
    cal.callCloseHandler();
    
  //close this Calendar form
  //cal.callCloseHandler();
}

// And this gets called when the end-user clicks on the _selected_ date,
// or clicks on the "Close" button.  It just hides the calendar without
// destroying it.
function closeHandler(cal) {
  cal.hide();                        // hide the calendar
}

function showCalendar(id,strType) {			
	dateType=strType;
	FirstOpenFlg=true
	if(strType=="0" || strType=="3" || strType=="5" || strType=="7" || strType=="10")
		ChinaDateFlg=false;
	else
		ChinaDateFlg=true;
  var strformat = 'y/mm/dd';
  var el = document.getElementById(id.name);
  var dc_date = '';
  var strTimeAry1;
  var strDate=el.value
  if(el.value.indexOf("/")<=0)
  {	
  	strDate=strDate.substring(0,strDate.length-4)+"/"+strDate.substring(strDate.length-4,strDate.length-2)+ "/"+strDate.substring(strDate.length-2,strDate.length);
  }
	if(el.value !=''){
		strTimeAry1=strDate.split("/")
		if(strTimeAry1[1].length==1) strTimeAry1[1]="0"+strTimeAry1[1]
		if(strTimeAry1[2].length==1) strTimeAry1[2]="0"+strTimeAry1[2]
		dc_date=(parseInt(strTimeAry1[0],10)) + "/" + strTimeAry1[1] + "/" + strTimeAry1[2]
   }
  if (calendar != null) {
    // we already have some calendar created
    calendar.hide();                 // so we hide it first.
  } else {
    // first-time call, create the calendar.
    var cal = new Calendar(false, null, selected, closeHandler);
    // uncomment the following line to hide the week numbers
    cal.weekNumbers = false;
    calendar = cal;                  // remember it in the global var
    cal.setRange(1900, 2070);        // min/max year allowed.
    cal.create();
  }

  calendar.setDateFormat(strformat);    // set the specified date format
  calendar.parseDate(dc_date);      // try to parse the text in field
  calendar.sel = el;                 // inform it what input field we use
  calendar.showAtElement(el);        // show the calendar below it
  return false;
}

var MINUTE = 60 * 1000;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
var WEEK = 7 * DAY;

function isDisabled(date) {
  var today = new Date();
  return (Math.abs(date.getTime() - today.getTime()) / DAY) > 10;
}

function flatSelected(cal, date) {
  var el = document.getElementById("preview");
  el.innerHTML = date;
}

function showFlatCalendar() {
  var parent = document.getElementById("display");

  // construct a calendar giving only the "selected" handler.
  var cal = new Calendar(false, null, flatSelected);

  // hide week numbers
  cal.weekNumbers = false;

  // We want some dates to be disabled; see function isDisabled above
  cal.setDisabledHandler(isDisabled);
  cal.setDateFormat("DD, M d");

  // this call must be the last as it might use data initialized above; if
  // we specify a parent, as opposite to the "showCalendar" function above,
  // then we create a flat calendar -- not popup.  Hidden, though, but...
  cal.create(parent);

  // ... we can show it here.
  cal.show();
}

//***********calendar-en.js
// ** I18N
Calendar._DN = new Array("日", "一", "二", "三", "四", "五", "六", "日");
Calendar._MN = new Array("一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月");

// tooltips
Calendar._TT = {};
Calendar._TT["TOGGLE"] = "Toggle first day of week";
Calendar._TT["PREV_YEAR"] = "上一年 (hold for menu)";
Calendar._TT["PREV_MONTH"] = "上一月 (hold for menu)";
Calendar._TT["GO_TODAY"] = "Go Today";
Calendar._TT["NEXT_MONTH"] = "下一月 (hold for menu)";
Calendar._TT["NEXT_YEAR"] = "下一年 (hold for menu)";
Calendar._TT["SEL_DATE"] = "Select date";
Calendar._TT["DRAG_TO_MOVE"] = "Drag to move";
Calendar._TT["PART_TODAY"] = " (today)";
Calendar._TT["MON_FIRST"] = "Display Monday first";
Calendar._TT["SUN_FIRST"] = "Display Sunday first";
Calendar._TT["CLOSE"] = "关闭";
Calendar._TT["TODAY"] = "今天";

// date formats
Calendar._TT["DEF_DATE_FORMAT"] = "y-mm-dd";
Calendar._TT["TT_DATE_FORMAT"] = "D, M d";

Calendar._TT["WK"] = "wk";

//============以下为日期格式转化和检测方法
/*javaScript字符串去空格的方法，用正则方法处理
**用法：var strA=strA.trim();
*/
String.prototype.trim=function()
{
	return this.replace(/(^\s*)|(\s*$)/g,'');
}
/******************************************************************************************
' 函数名称 : IsCDate
' 目    的 : 判断日期是否正确
' 参数说明 : obj : 日期对象值
'            stype : 日期类型，0：非标准日期19970807，1：标准日期1997/8/7
'            CDate : 民国日期，0：公元日期，  1：民国日期
'******************************************************************************************/
//判断日期
function IsCDate(objV,sType,CDate)
{	var objV=objV.trim();
	var sY;
	var sM;
	var sD;
	var str;
	if(sType==0)//非标准日期
	{	sY=objV.substring(0,objV.length-4);
		sM=objV.substring(objV.length-4,objV.length-2);
		sD=objV.substring(objV.length-2,objV.length);
	}
	if(sType==1)//标准日期
	{	var strTimeAry1=objV.split("/");
		sY=strTimeAry1[0];
		sM=strTimeAry1[1];
		sD=strTimeAry1[2];
	}
	if(CDate=1)
		sY=sY*1+1911;
	
	str=sY+"/"+sM+"/"+sD
	var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);  
	if(r==null)return false;  
	var d= new Date(r[1], r[3]-1, r[4]);  
	return (d.getFullYear()==r[1] && (d.getMonth()+1)==r[3] && d.getDate()==r[4]); 
	
}

/******************************************************************************************
' 函数名称 : gChangeDate
' 目    的 : 转换日期显示格式
' 参数说明 : strDate : 日期
'            vintType : 转换的形式
' 传 回 值 : strChangeDate : 转换后的日期
' 副 作 用 : 无
' 范    例 : gChangeDate(this,0)
' 备    注 : 可接收日期格式 19970807,1997/8/7,85/8/7,850809,87-9-8
'      case 0   '1997/08/05'
'      case 1   '85/08/05'
'      case 2   '085/08/05'
'      case 3   '1997年08月05日
'      case 4   '86年08月05日
'      case 5   '1997年08月05日星期一
'      case 6   '86年08月05日星期一
'      case 7   '19970805
'      case 8   '860805
'      case 9   '0860805
'      case 10   '星期一
'      case 11   ' 860805
'      case 12   ' 86/08/05
'      case 13   ' 86/8/5
'      Else
'         strChangeDate = "没有指定输出形态"
'******************************************************************************************/
function gChangeDate(vobjName,vintType)
{
	var strDay,strMonth,strYear,strCYear,strTimeAry
	var strDate,StandDate,strWeekName,datDate,intNum,strChangeDate
	var resStr="";
	if(vintType=="0" || vintType=="3" || vintType=="5" || vintType=="7" || vintType=="10")
		ChinaDateFlg=false;
	else
		ChinaDateFlg=true;
		
	strDate=vobjName.value.trim();	
	if(strDate=="")	return; //若为空值, 则不做
	//转换日期为标准模式 "1997/5/6"
	//XXXX-XX-XX
	if (strDate.indexOf("-")!=0)
	{	 resStr="";
		for(var i=0;i<strDate.length;i++)
			resStr=resStr +((strDate.substring(i,i+1)).replace('-','/'));
		strDate=resStr;
	}
	//XXXX.XX.XX
	if (strDate.indexOf(".")!=0)
	{	resStr="";
		for(var i=0;i<strDate.length;i++)
			resStr=resStr +((strDate.substring(i,i+1)).replace('.','/'));
		strDate=resStr;
	}
	//XXXXXXXX
	if (strDate.indexOf("/")<=0)
	 	strDate=strDate.substring(0,strDate.length-4)+"/"+strDate.substring(strDate.length-4,strDate.length-2)+ "/"+strDate.substring(strDate.length-2,strDate.length);

	//若输入日期为12/23/23 应该是不合理的情况 ->先转成西元年格式再做判断
	var strTimeAry1=strDate.split("/");
	if(strTimeAry1.length!=3)
	{		
  		alert("请输入日期,格式为:年月日") ;
		vobjName.value="";
    		vobjName.focus();
		return;
	}
	if (strTimeAry1[0].length!=4)
	{
		strTimeAry1[0]=strTimeAry1[0]*1;
		strDate=strTimeAry1[0]+"/"+strTimeAry1[1]+"/"+strTimeAry1[2];
	}
	//判断日期是否合法
	if(!ChinaDateFlg)
  		var idDate=IsCDate(strDate,1,0);
  	else
  		var idDate=IsCDate(strDate,1,1);
	if(!idDate)
	{
		alert("请输入日期, 格式为年月日") ;
		vobjName.value="";
		vobjName.focus();
		return;
	}
	strYear  = strTimeAry1[0];
   	strCYear = strYear.toString();
   	strMonth = strTimeAry1[1];
   	strDay   = strTimeAry1[2];
   	datDate = strYear + "/" + strMonth + "/" + strDay;
   	
   	//OK 现在有标准的日期格式
	//找出星期几
   	if(!ChinaDateFlg)
   		var dateNew= new Date(datDate)
   	else
   		var dateNew= new Date((strCYear*1+1911)+ "/" + strMonth + "/" + strDay)
	var strWeekName="";
	switch (dateNew.getDay())
	{	case 0:
			strWeekName = "星期日";
			break;
		case 1:
			strWeekName = "星期一";
			break;
		case 2:
			strWeekName = "星期二";
			break;
		case 3:
			strWeekName = "星期三";
			break;
		case 4:
			strWeekName = "星期四";
			break;
		case 5:
			strWeekName = "星期五";
			break;
		case 6:
			strWeekName = "星期六";
			break;
	}
   	switch(vintType)
   	{
  		case 0 :  //1997/08/05'
 			if(strMonth.length==1)
    			strMonth = "0" + strMonth;
 			if(strDay.length==1)
    			strDay = "0" + strDay;
 			strChangeDate = strYear + "/" + strMonth + "/" + strDay;
			break;
  		case 1 :  //85/08/05'
     		strChangeDate = strCYear + "/" + strMonth + "/" + strDay;
			break;
  		case 2 :  //085/08/05'
 			if(strMonth.length==1)
    			strMonth = "0" + strMonth;
 			if(strDay.length==1)
    			strDay = "0" + strDay;
     		if(strCYear.length==2)
        		strCYear = "0" + strCYear;
     		strChangeDate = strCYear + "/" + strMonth + "/" + strDay;
			break;
  		case 3 :  //1997年08月05日
 			if(strMonth.length==1)
    			strMonth = "0" + strMonth;
 			if(strDay.length==1)
    			strDay = "0" + strDay;
     		strChangeDate = strYear + "年" + strMonth + "月" + strDay + "日";
			break;
  		case 4 :  //86年08月05日
 			if(strMonth.length==1)
    			strMonth = "0" + strMonth;
 			if(strDay.length==1)
    			strDay = "0" + strDay;
     		strChangeDate = strCYear + "年" + strMonth + "月" + strDay + "日";
			break;
  		case 5 :  //1997年08月05日星期一
 			if(strMonth.length==1)
    			strMonth = "0" + strMonth;
 			if(strDay.length==1)
    			strDay = "0" + strDay;
     		strChangeDate = strYear+"年" + strMonth + "月" + strDay + "日" + strWeekName;
			break;
  		case 6 :  //86年08月05日星期一
 			if(strMonth.length==1)
    			strMonth = "0" + strMonth;
 			if(strDay.length==1)
    			strDay = "0" + strDay;
     		strChangeDate = strCYear + "年" + strMonth + "月" + strDay + "日" + strWeekName;
			break;
 		case 7 :  //19970805
  			if(strMonth.length==1)
    			strMonth = "0" + strMonth;
 			if(strDay.length==1)
    			strDay = "0" + strDay;
     		strChangeDate = strYear + strMonth + strDay;
			break;
  		case 8 :  //860805
  			if(strMonth.length==1)
    			strMonth = "0" + strMonth;
 			if(strDay.length==1)
    			strDay = "0" + strDay;
 			strChangeDate = strCYear + strMonth + strDay;
			break;
  		case 9:   //0860805
  			if(strMonth.length==1)
    			strMonth = "0" + strMonth;
 			if(strDay.length==1)
    			strDay = "0" + strDay;
 			if(strCYear.length==2)
    			strCYear = "0" + strCYear;
 			strChangeDate = strCYear + strMonth + strDay;
			break;
  		case 10 :  //星期一
     			strChangeDate = strWeekName;
			break;
  		case 11:   // 860805
 			if(strMonth.length==1)
    			strMonth = "0" + strMonth;
 			if(strDay.length==1)
    			strDay = "0" + strDay;
 			if(strCYear.length==2)
    			strCYear = " " + strCYear;
 			strChangeDate = strCYear + strMonth + strDay;
			break;
  		case 12 :  // 86/08/05
 			if(strMonth.length==1)
    			strMonth = "0" + strMonth;
 			if(strDay.length==1)
    			strDay = "0" + strDay;
 			if(strCYear.length==2)
    			strCYear = " " + strCYear;
 			strChangeDate = strCYear + "/" + strMonth + "/" + strDay;
			break;
  		case 13 :  // 94/1/1
 			if(strCYear.length==2)
    			strCYear = " " + strCYear;
 			strMonth=strMonth*1
 			strDay=strDay*1
 			strCYear=strCYear*1
 			strChangeDate = strCYear + "/" + strMonth + "/"+ strDay ;
			break;        			
  		default:
     			strChangeDate =vobjName.value;// "没有指定输出形态";
			break;
   	}
	vobjName.value=strChangeDate ;
}