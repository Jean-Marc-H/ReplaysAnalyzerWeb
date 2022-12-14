var mode="Overview";
var monIndex=0;
var checkingPokemon=false;
var replayFilters={
    //0=doesn't matter
    //1=yes
    //2=no
    terad:0,
    won:0,
    led:0
}
var tempReplays=[];

function GetTempWins()
{
    var wins=0;
    for(var i=0;i<tempReplays.length;i++)
    {
        if(tempReplays[i].won)
        {
            wins++;
        }
    }
    return wins;
}

function GetTempLead(monIndex)
{
    var leads=0;
    for(var i=0;i<tempReplays.length;i++)
    {
        if(WasYourLead(tempReplays[i], monIndex))
        {
            leads++;
        }
    }
    return leads;
}

function GetTempTeras(monIndex)
{
    var teras=0;
    for(var i=0;i<tempReplays.length;i++)
    {
        if(tempReplays[i].teraId==monIndex)
        {
            teras++;
        }
    }
    return teras;
}

function GetTempMoveUses(move)
{
    var uses=0;
    if(move==null)
    {
        return uses;
    }
    for(var i=0;i<tempReplays.length;i++)
    {
        for(var j=0;j<tempReplays[i].teams[tempReplays[i].wantedPlayerId].pokemon[monIndex].moves.length;j++)
        {
            if(move.name===tempReplays[i].teams[tempReplays[i].wantedPlayerId].pokemon[monIndex].moves[j].name)
            {
                uses+=tempReplays[i].teams[tempReplays[i].wantedPlayerId].pokemon[monIndex].moves[j].timesUsed;
            }
        }
    }
    return uses;
}

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
        if(PassesFilter(team.replays[i], 0))
        {
            html+=GetReplay(team.replays[i]);
        }
    }
    html+="</table>";
    return html;
}

function GetOptions()
{
    var html='<span class="option'+((mode==="Overview")?" selected":"")+'" onclick="ChangeOption(\'Overview\')">Overview</span>';
    html+='<span class="option'+((mode==="Leads")?" selected":"")+'" onclick="ChangeOption(\'Leads\')">Leads</span>';
    html+='<span class="option'+((mode==="Replays")?" selected":"")+'" onclick="ChangeOption(\'Replays\')">Replays</span>';
    if(mode=="Replays")
    {
        html+="<br/>";
        html+="<span class='filter' value="+replayFilters.won+" onclick='UpdateFilter(\"won\")'>Won</span>";
    }
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
    ResetFilters();
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
    ResetFilters();
    UpdateView();
}

function PassesFilter(replay, pokemonIndex)
{
    switch(replayFilters.terad)
    {
        case 0:
            break;
        case 1:
            if(replay.teraId!=pokemonIndex)
            {
                return false;
            }
            break;
        case 2:
            if(replay.teraId==pokemonIndex)
            {
                return false;
            }
            break;
        default:
            break;
    }
    switch(replayFilters.won)
    {
        case 0:
            break;
        case 1:
            if(!replay.won)
            {
                return false;
            }
            break;
        case 2:
            if(replay.won)
            {
                return false;
            }
            break;
        default:
            break;
    }
    switch(replayFilters.led)
    {
        case 0:
            break;
        case 1:
            if(!WasYourLead(replay, pokemonIndex))
            {
                return false;
            }
            break;
        case 2:
            if(WasYourLead(replay, pokemonIndex))
            {
                return false;
            }
            break;
        default:
            break;
    }
    return true;
}

function PokemonView()
{
    var optionsHtml="";
    optionsHtml+="<span class='filter' value="+replayFilters.terad+" onclick='UpdateFilter(\"tera\")'>Tera'd</span>";
    optionsHtml+="<span class='filter' value="+replayFilters.won+" onclick='UpdateFilter(\"won\")'>Won</span>";
    optionsHtml+="<span class='filter' value="+replayFilters.led+" onclick='UpdateFilter(\"led\")'>Led</span>";
    document.getElementsByClassName("options")[0].innerHTML=optionsHtml;

    var statsHtml="<table>";
    statsHtml+=GetReplayTableHeader();
    tempReplays=[];
    for(var i=0;i<team.replays.length;i++)
    {
        if((CheckIfBrought(team.replays[i].wantedPlayerId, team.replays[i], monIndex)!="")&&PassesFilter(team.replays[i], monIndex))
        {
            statsHtml+=GetReplay(team.replays[i]);
            tempReplays[tempReplays.length]=team.replays[i];
        }
    }
    statsHtml+="</table>";
    document.getElementsByClassName("stats")[0].innerHTML=statsHtml;

    var html="<div class='button back-button' onclick='BackButton()'>back</div><table><tr><td class=\"pokemon\" rowspan=\"7\"><img src='"+GetSpriteUrl(team.pokemon[monIndex].name)+"'></td><th>Times Brought</th><th>% brought</th><th>Times Won</th><th>% won</th></tr>";
    html+="<tr>";
    html+="<td>"+tempReplays.length+"</td>";
    html+="<td>"+calculatePercentage(tempReplays.length, team.replays.length)+"</td>";
    html+="<td>"+GetTempWins()+"</td>";
    html+="<td>"+calculatePercentage(GetTempWins(), tempReplays.length)+"</td>";
    html+="</tr>";
    html+="<tr><th>Times Led</th><th>% Led</th><th>Times Tera'd</th><th>% Tera'd</th></tr>";
    html+="<tr>";
    html+="<td>"+GetTempLead(monIndex)+"</td>";
    html+="<td>"+calculatePercentage(GetTempLead(monIndex), tempReplays.length)+"</td>";
    html+="<td>"+GetTempTeras(monIndex)+"</td>";
    html+="<td>"+calculatePercentage(GetTempTeras(monIndex), tempReplays.length)+"</td>";
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
        html+="<td>Used "+GetTempMoveUses(team.pokemon[monIndex].moves[i])+" time(s)</td>";
    }
    html+="</tr>";
    html+="<tr>";
    for(var i=0;i<4;i++)
    {
        html+="<td>"+roundTwoDigits(GetTempMoveUses(team.pokemon[monIndex].moves[i])/tempReplays.length)+"/game avg</td>";
    }
    html+="</tr>";
    html+="</table>";
    document.getElementsByClassName("pokemon-div")[0].innerHTML=html;
}

function ResetFilters()
{
    replayFilters.terad=0;
    replayFilters.won=0;
    replayFilters.led=0;
}

function UpdateFilter(value)
{
    if(value=="tera")
    {
        replayFilters.terad=(replayFilters.terad+1)%3;
    }
    else if(value=="won")
    {
        replayFilters.won=(replayFilters.won+1)%3;
    }
    else if(value=="led")
    {
        replayFilters.led=(replayFilters.led+1)%3;
    }
    UpdateView();
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
}

document.addEventListener("DOMContentLoaded", function(event) {
    UpdateView();
});