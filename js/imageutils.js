var iconUrl="https://img.pokemondb.net/sprites/scarlet-violet/normal/1x/";
var iconNames={
    "Tauros-Paldea-Water":"tauros-paldean-water",
    "Tauros-Paldea-Fire":"tauros-paldean-fire",
    "Iron Bundle":"iron-bundle",
    "Iron Hands":"iron-hands",
    "Roaring Moon":"roaring-moon",
    "Maushold-Four":"maushold-family4",
    "Indeedee-F":"indeedee-female"
}

var spriteurl="https://play.pokemonshowdown.com/sprites/dex/";
var gen5spriteurl="https://play.pokemonshowdown.com/sprites/gen5/";
var spriteNames={
    "Tauros-Paldea-Water":"tauros-paldeawater",
    "Tauros-Paldea-Fire":"tauros-paldeafire",
    "Iron Bundle":"ironbundle",
    "Iron Hands":"ironhands",
    "Roaring Moon":"roaringmoon",
    "Ting-Lu":"tinglu",
    "Chi-Yu":"chiyu",
    "Dudunsparce-Three-Segment":"dudunsparce-threesegment"
}

var mustUseGen5=[
    "Grimmsnarl"
];

function GetIconName(name)
{
    if(iconNames[name]==null)
    {
        return name.toLowerCase();
    }
    return iconNames[name];
}

function GetSpriteName(name)
{
    if(spriteNames[name]==null)
    {
        return name.toLowerCase();
    }
    return spriteNames[name];
}

function GetIconUrl(name)
{
    var iconName=GetIconName(name);
    return iconUrl+iconName+".png";
}

function MustUseGen5(name)
{
    for(var i=0;i<mustUseGen5.length;i++)
    {
        if(mustUseGen5[i]==name)
        {
            return true;
        }
    }
    return false;
}

function GetSpriteUrl(name)
{
    if(MustUseGen5(name))
    {
        return gen5spriteurl+GetSpriteName(name)+".png";
    }
    return spriteurl+GetSpriteName(name)+".png";
}