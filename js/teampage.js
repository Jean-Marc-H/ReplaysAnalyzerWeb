var mode="Overview";
var monIndex=0;
var checkingPokemon=false;

function GetPokemonIcons()
{
    var html="";
    for(var i=0;i<team.pokemon.length;i++)
    {
        html+="<img class='teamMember' onclick=EnablePokemonView("+i+") src='"+GetIconUrl(team.pokemon[i].name)+"'>";
    }
    return html;
}

function GetLeadData()
{
    var html="<table>\n";
    html+="<tr>";
    html+="<th class='leadSprite'>Lead</th>";
    html+='<th class="leadStat">Times led</th>';
    html+='<th class="leadStat">% led</th>';
    html+='<th class="leadStat">Times won</th>';
    html+='<th class="leadStat">% won</th>'
    html+="</tr>\n";
    for(var i=0;i<team.leads.length;i++)
    {
        html+="<tr>";
        html+="<td class='leadMembers'>"
        html+="<img class='teamMember first-lead' src='"+GetIconUrl(team.pokemon[team.leads[i].firstpokemon].name)+"'>";
        html+="<img class='teamMember second-lead' src='"+GetIconUrl(team.pokemon[team.leads[i].secondpokemon].name)+"'>";
        html+="</td>";
        html+="<td class='leadStat'>"+team.leads[i].timesbrought+"</td>";
        html+="<td class='leadStat'>"+Math.round((team.leads[i].timesbrought/team.replays.length)*10000)/100+"%</td>";
        html+="<td class='leadStat'>"+team.leads[i].timeswon+"</td>";
        html+="<td class='leadStat'>"+Math.round((team.leads[i].timeswon/team.leads[i].timesbrought)*10000)/100+"%</td>";
        html+="</tr>";
    }
    html+="</table>";
    return html;
}

function GetOverviewData()
{
    var html="<table>\n";
    html+="<tr>";
    html+="<th class='leadSprite'>Pokemon</th>";
    html+='<th class="leadStat">% brought</th>';
    html+='<th class="leadStat">% led</th>';
    html+='<th class="leadStat">% won</th>'
    html+='<th class="leadStat">% tera\'d</th>';
    html+="</tr>\n";
    for(var i=0;i<team.pokemon.length;i++)
    {
        html+="<tr>";
        html+="<td class='leadMembers'>"
        html+="<img class='pokemon-overview' onclick='EnablePokemonView("+i+")' src='"+GetSpriteUrl(team.pokemon[i].name)+"'>";
        html+="</td>";
        html+="<td class='leadStat'>"+calculatePercentage(team.pokemon[i].gamesbrought, team.replays.length)+"%</td>";
        html+="<td class='leadStat'>"+calculatePercentage(getTimesLed(i), team.pokemon[i].gamesbrought)+"%</td>";
        html+="<td class='leadStat'>"+calculatePercentage(team.pokemon[i].timesWon, team.pokemon[i].gamesbrought)+"%</td>";
        html+="<td class='leadStat'>"+calculatePercentage(team.pokemon[i].timesTerad, team.replays.length)+"%</td>";
        html+="</tr>";
    }
    html+="<tr>";
        html+="<td class='leadMembers'>"
        html+="<b>Overall</b>";
        html+="</th>";
        html+="<td class='leadStat'>"+team.replays.length+"</td>";
        html+="<td class='leadStat'>N/A</td>";
        html+="<td class='leadStat'>"+calculatePercentage(GetTotalWins(), team.replays.length)+"%</td>";
        html+="<td class='leadStat'>"+calculatePercentage(GetTotalTeras(), team.replays.length)+"%</td>";
        html+="</tr>";
    html+="</table>";
    return html;
}

function GetReplayTableHeader()
{
    html="<tr>";
    html+="<th class='leadStat' colspan='6'>You</th>";
    html+='<th class="leadStat" colspan="7">Opponent</th>';
    html+='<th class="leadStat">Won?</th>';
    html+="</tr>\n";
    return html;
}

function OpenReplay(replayLink)
{
    window.open(replayLink);
}

function GetReplay(replay)
{
    html="<tr onclick='OpenReplay(\"../replays/"+replay.link+"\")'>";
    for(var i=0;i<replay.teams[replay.wantedPlayerId].pokemon.length;i++)
    {
        html+="<td class='leadMembers"+CheckIfBrought(replay.wantedPlayerId, replay, i)+CheckIfTerad(replay.wantedPlayerId, replay, i)+"'>";
        html+="<img class='replay-icon' src='"+GetIconUrl(replay.teams[replay.wantedPlayerId].pokemon[i].name)+"'>";
        html+="</td>";
    }
    html+="<td class='leadMembers opponent'>"+replay.players[1-replay.wantedPlayerId].username+"<br>"+replay.players[1-replay.wantedPlayerId].rating+"</td>";
    for(var i=0;i<replay.teams[1-replay.wantedPlayerId].pokemon.length;i++)
    {
        html+="<td class='leadMembers "+CheckIfBrought(1-replay.wantedPlayerId, replay, i)+"'>";
        html+="<img class='replay-icon' src='"+GetIconUrl(replay.teams[1-replay.wantedPlayerId].pokemon[i].name)+"'>";
        html+="</td>";
    }
    html+="<td class='leadStat'>"+(replay.won ? "Yes":"No")+"</td>";
    html+="</tr>";
    return html;
}

function GetReplayData()
{
    var html="<table>\n";
    html+=GetReplayTableHeader();
    for(var i=0;i<team.replays.length;i++)
    {
        html+=GetReplay(team.replays[i]);
    }
    html+="</table>";
    return html;
}

function GetOptions()
{
    var html='<span class="option'+((mode==="Overview")?" selected":"")+'" onclick="ChangeOption(\'Overview\')">Overview</span>';
    html+='<span class="option'+((mode==="Leads")?" selected":"")+'" onclick="ChangeOption(\'Leads\')">Leads</span>';
    html+='<span class="option'+((mode==="Replays")?" selected":"")+'" onclick="ChangeOption(\'Replays\')">Replays</span>';
    return html;
}

function GetData()
{
    if(mode=="Overview")
    {
        return GetOverviewData();
    }
    else if(mode=="Leads")
    {
        return GetLeadData();
    }
    else if(mode=="Replays")
    {
        return GetReplayData();
    }
}

function TeamView()
{
    document.getElementsByClassName("pokemon-div")[0].innerHTML="";
    document.getElementsByClassName("team")[0].innerHTML=GetPokemonIcons();
    document.getElementsByClassName("options")[0].innerHTML=GetOptions();
    document.getElementsByClassName("stats")[0].innerHTML=GetData();
}

function EnablePokemonView(index)
{
    monIndex=index;
    checkingPokemon=true;
    UpdateView();
}

function ChangeOption(value)
{
    mode=value;
    UpdateView();
}

function BackButton()
{
    checkingPokemon=false;
    UpdateView();
}

function AddButtons()
{
}

function PokemonView()
{
    var html="<div class='button back-button' onclick='BackButton()'>back</div><table><tr><td class=\"pokemon\" rowspan=\"7\"><img src='"+GetSpriteUrl(team.pokemon[monIndex].name)+"'></td><th>Times Brought</th><th>% brought</th><th>Times Won</th><th>% won</th></tr>";
    html+="<tr>";
    html+="<td>"+team.pokemon[monIndex].gamesbrought+"</td>";
    html+="<td>"+calculatePercentage(team.pokemon[monIndex].gamesbrought, team.replays.length)+"</td>";
    html+="<td>"+team.pokemon[monIndex].timesWon+"</td>";
    html+="<td>"+calculatePercentage(team.pokemon[monIndex].timesWon, team.pokemon[monIndex].gamesbrought)+"</td>";
    html+="</tr>";
    html+="<tr><th>Times Led</th><th>% Led</th><th>Times Tera'd</th><th>% Tera'd</th></tr>";
    html+="<tr>";
    html+="<td>"+getTimesLed(monIndex)+"</td>";
    html+="<td>"+calculatePercentage(getTimesLed(monIndex), team.pokemon[monIndex].gamesbrought)+"</td>";
    html+="<td>"+team.pokemon[monIndex].timesTerad+"</td>";
    html+="<td>"+calculatePercentage(team.pokemon[monIndex].timesTerad, team.pokemon[monIndex].gamesbrought)+"</td>";
    html+="</tr>";
    html+="<tr>";
    for(var i=0;i<4;i++)
    {
        html+="<th>"+GetMoveName(team.pokemon[monIndex], i)+"</th>";
    }
    html+="</tr>";
    html+="<tr>";
    for(var i=0;i<4;i++)
    {
        html+="<td>Used "+GetMoveUses(team.pokemon[monIndex], i)+" time(s)</td>";
    }
    html+="</tr>";
    html+="<tr>";
    for(var i=0;i<4;i++)
    {
        html+="<td>"+roundTwoDigits(GetMoveUses(team.pokemon[monIndex], i)/team.pokemon[monIndex].gamesbrought)+"/game avg</td>";
    }
    html+="</tr>";
    html+="</table>";
    document.getElementsByClassName("pokemon-div")[0].innerHTML=html;

    var statsHtml="<table>";
    statsHtml+=GetReplayTableHeader();
    for(var i=0;i<team.replays.length;i++)
    {
        if(CheckIfBrought(team.replays[i].wantedPlayerId, team.replays[i], monIndex)!="")
        {
            statsHtml+=GetReplay(team.replays[i]);
        }
    }
    statsHtml+="</table>";
    document.getElementsByClassName("stats")[0].innerHTML=statsHtml;
}

function UpdateView()
{
    if(checkingPokemon)
    {
        PokemonView();
    }
    else
    {
        TeamView();
    }
    AddButtons();
}

document.addEventListener("DOMContentLoaded", function(event) {
    UpdateView();
});