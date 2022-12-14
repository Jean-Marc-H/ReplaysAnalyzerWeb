function calculatePercentage(numerator, denominator)
{
    return Math.round((numerator/denominator)*10000)/100;
}

function roundTwoDigits(number)
{
    return Math.round(number*100)/100;
}

function getTimesLed(index)
{
    var timesLed=0;
    for(var i=0;i<team.leads.length;i++)
    {
        if(team.leads[i].firstpokemon==index||team.leads[i].secondpokemon==index)
        {
            timesLed+=team.leads[i].timesbrought;
        }
    }
    return timesLed;
}

function GetTotalWins()
{
    var wins=0;
    for(var i=0;i<team.leads.length;i++)
    {
        wins+=team.leads[i].timeswon;
    }
    return wins;
}

function GetTotalTeras()
{
    var teras=0;
    for(var i=0;i<team.pokemon.length;i++)
    {
        teras+=team.pokemon[i].timesTerad;
    }
    return teras;
}

function CheckIfBrought(id, replay, j)
{
    if(id==0)
    {
        for(var k=0;k<replay.player1brought.length;k++)
        {
            if(replay.player1brought[k]==j)
            {
                return " brought";
            }
        }
    }
    else if(id==1)
    {
        for(var k=0;k<replay.player2brought.length;k++)
        {
            if(replay.player2brought[k]==j)
            {
                return " brought";
            }
        }
    }
    return "";
}

function CheckIfTerad(id, replay, j)
{
    if(id==0)
    {
        for(var k=0;k<replay.player1brought.length;k++)
        {
            if(replay.teraId==j)
            {
                return " terad";
            }
        }
    }
    else if(id==1)
    {
        for(var k=0;k<replay.player2brought.length;k++)
        {
            if(replay.teraId==j)
            {
                return " terad";
            }
        }
    }
    return "";
}

function GetMoveName(pokemon, index)
{
    return (pokemon.moves[index]==null) ? "Move not used" : pokemon.moves[index].name;
}

function GetMoveUses(pokemon, index)
{
    return (pokemon.moves[index]==null) ? 0 : pokemon.moves[index].timesUsed;
}

function WasYourLead(replay, monIndex)
{
    var brought=(replay.wantedPlayerId==0)?replay.player1brought:replay.player2brought;
    return (brought[0]==monIndex||brought[1]==monIndex);
}