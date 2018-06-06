var MenuConfig = { 
defaultText : "Menu Item", 
defaultAction : "javascript:void(0);" , 
defaultMenuCssStyle : "menuMain" 
}; 

var MenuHandler = { 
idCounter : 0, 
idPrefix : "menu-", 
getId : function(){ return this.idPrefix + this.idCounter++ ;}, 
insertHTMLBeforeEnd : function(node, sHTML){ 
if(node.insertAdjacentHTML != null){ 
node.insertAdjacentHTML('BeforeEnd',sHTML); 
return; 
} 
var df; // DocumentFragment 
var r = node.ownerDocument.createRange(); 
r.selectNodeContents(node); 
r.collapse(false); 
df = r.createContextualFragment(sHTML); 
node.appendChild(df); 
} 
} 

function displaySubMenu(li){ 
var subMenu = li.getElementsByTagName('ul')[0]; 
if(subMenu) 
subMenu.style.display = 'block'; 
} 

function hideSubMenu(li){ 
var subMenu = li.getElementsByTagName('ul')[0]; 
if(subMenu) 
subMenu.style.display = 'none'; 
} 


/****************************************** 
* Funciont Name: MenuAbstractNode 
* Description： MenuAbstractNode class 
* @param {String} pText 
* @param {String} pAction 
* @Return： 
*******************************************/ 
function MenuAbstractNode(pText, pAction){ 
this.text = pText || MenuConfig.defaultText; 
this.action = pAction || MenuConfig.defaultAction; 
this.id = MenuHandler.getId(); 

this.childNodes = []; 
} 

MenuAbstractNode.prototype.add = function(node){ 
this.childNodes[this.childNodes.length] = node; 
} 

/****************************************** 
* Funciont Name: toString 
* Description： generate HTML code 
* @param 
* @param 
* @Return： 
*******************************************/ 
MenuAbstractNode.prototype.toString = function(){ 
var str = "<li id=\"" + this.id + "\" onmouseover=\"displaySubMenu(this)\" onmouseout=\"hideSubMenu(this)\"><a href=\"#\""; 

if(this.type=="Menu"){ 
str = str + " class=\"" + this.cssStyle + "\""; 
} 
str = str + " onclick=\""+this.action+"\">"+this.text+"</a>"; 

var sb = []; 

for (var i = 0; i < this.childNodes.length; i++) { 
sb[i] = this.childNodes[i].toString(); 
} 
if(sb.length>0){ 
str = str + "<ul>" + sb.join("") + "</ul>" 
} 

return str + "</li>" ; 
} 

/****************************************** 
* Funciont Name: Menu 
* Description： Menu class 
* @param {String} pText 
* @param {String} pAction 
* @param {String} pCssStyle 
* @Return： 
*******************************************/ 
function Menu(pText, pAction,pCssStyle){ 
this.base = MenuAbstractNode; 
this.base(pText,pAction); 

this.type = "Menu"; 
this.cssStyle = pCssStyle || MenuConfig.defaultMenuCssStyle; 
} 

Menu.prototype = new MenuAbstractNode; 

/****************************************** 
* Funciont Name: MenuItem 
* Description： MenuItem class 
* @param {String} pText 
* @param {String} pAction 
* @Return： 
*******************************************/ 
function MenuItem(pText, pAction){ 
this.base = MenuAbstractNode; 
this.base(pText,pAction); 
this.type = "MenuItem"; 
} 

MenuItem.prototype = new MenuAbstractNode; 


/****************************************** 
* Funciont Name: Root 
* Description： Root class 
* @Return： 
*******************************************/ 
function Root(){ 
this.id = "menubar"; 
this.childNodes=[]; 
} 

Root.prototype = new MenuAbstractNode; 

Root.prototype.toString = function(){ 
document.write("<div id='menu'><ul id=\""+root.id+"\"> </ul> </div>"); 
for(var i=0; i<this.childNodes.length; i++){ 
MenuHandler.insertHTMLBeforeEnd(document.getElementById(root.id), this.childNodes[i].toString()); 
} 
} 

if (document.getElementById){ 
var root = new Root(); 

var m1 = new Menu("File","alert(this.innerText);"); 
root.add(m1); 
var m11 = new MenuItem("New","alert(this.innerText);"); 
m1.add(m11); 
m1.add(new MenuItem("Open","alert('open file');")); 
var m12 = new MenuItem("Save"); 
m1.add(m12); 
m1.add(new MenuItem("Save As")); 
m1.add(new MenuItem("Close")); 
m1.add(new MenuItem("")); 

var m2 = new Menu("Edit"); 
root.add(m2); 
var m22 = new MenuItem("Select All"); 
m2.add(m22); 
m2.add(new MenuItem("Cut")); 
m2.add(new MenuItem("Copy")); 
m2.add(new MenuItem("paste")); 

var m3 = new Menu("View"); 
var m33 = new MenuItem("View List"); 
m33.add(new MenuItem("Function List")); 
m3.add(m33); 
m3.add(new MenuItem("Tool Bar")); 
root.add(m3); 
root.toString(); 
}
