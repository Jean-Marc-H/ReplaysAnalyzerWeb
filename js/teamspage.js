function GetPokemonIcons(team)
{
    var html="";
    for(var i=0;i<team.pokemon.length;i++)
    {
        html+="<img class='teamMember' src='"+GetIconUrl(team.pokemon[i].name)+"'>";
    }
    return html;
}

function GetTeam(team, index)
{
    var html="<div class='team-option'><a href='teams/team"+index+".html'>";
    html+=GetPokemonIcons(team);
    html+="</a></div>";
    return html;
}

function GetTeams()
{
    html="";
    for(var i=0;i<teams.length;i++)
    {
        html+=GetTeam(teams[i], i);
    }
    return html;
}

document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementsByClassName("main")[0].innerHTML=GetTeams();
});