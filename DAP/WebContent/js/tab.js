function Tab(n) 
{
  for (i=1;i<=7;i++)
  {
    document.getElementById("s"+i).className="tab-1";
    document.getElementById("tab"+i).style.display='none';
  }
    document.getElementById("s"+n).className="tab-2";
    document.getElementById("tab"+n).style.display='';
}