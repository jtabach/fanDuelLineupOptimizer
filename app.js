
//$(document).ready(function() {
//    
//    $.ajax({
//        url: "https://api.fantasydata.net/nfl/v2/JSON/DailyFantasyPlayers/2015-DEC-28",
//        beforeSend: function( xhr ) {
//            xhr.setRequestHeader( "ocp-apim-subscription-key", "fef6d106068342f1b70fa527c6421aa1" ); //Free trial key..
//        },
//        type: "GET",
//        contentType: "application/json",
//        dataType: "text"
//    })
//    .done(function( data ) {
//    
//      console.log( "Sample of data:");
//    
//    });
//    
//});

// Goal: To optimize a lineup for fanduel fantasy football based on projected points and player cost.
// Unfortunately, due to the very large object and billions of possible lineups, some restrictions had to be put in place.
// For example, a minimum projection of points for a player.

players.forEach(function(player, index) {
    if (player.StatusColor === "red") {
        delete players[index];
    }
    if (player.Position === "QB" && player.ProjectedFantasyPoints < 15 ) {
        delete players[index];
    }
    if (player.Position === "RB" && player.ProjectedFantasyPoints < 15 ) {
        delete players[index];
    }
    if (player.Position === "WR" && player.ProjectedFantasyPoints < 13 ) {
        delete players[index];
    }
    if (player.Position === "TE" && player.ProjectedFantasyPoints < 10) {
        delete players[index];
    }
    if (player.Position === "DEF" && player.ProjectedFantasyPoints < 7 ) {
        delete players[index];
    }
    if (player.Position === "K" && player.ProjectedFantasyPoints < 7 ) {
        delete players[index];
    }
    
    // Deleted unused properties in attempt to shorten runtime.
    delete player.PlayerID;
    delete player.Date;
    delete player.Salary;
    delete player.DraftKingsSalary;
    delete player.Opponent ;
    delete player.LastGameFantasyPoints;
    delete player.OpponentPositionRank;
    delete player.OpponentRank;
    delete player.ShortName;
    delete player.Status;
    delete player.StatusCode;
    delete player.StatusColor;
    delete player.Team;
    delete player.YahooSalary;
});
console.log(players);

var qbs = [];
var rbs = [];
var wrs = [];
var tes = [];
var dst = [];
var kck = [];

players.forEach(function(player, index) {
    if (player.Position === "QB") {
        qbs.push(player);
    } else if (player.Position === "RB") {
        rbs.push(player);
    } else if (player.Position === "WR") {
        wrs.push(player);
    } else if (player.Position === "TE") {
        tes.push(player);
    } else if (player.Position === "DEF") {
        dst.push(player);
    } else if (player.Position === "K") {
        kck.push(player);
    }
});

console.log(wrs);
var potentialteams = [];
var tempteam = [];


// FanDeul positions: QB, RB, RB, WR, WR, WR, TE, K, DEF
for (var qb1 = 0; qb1 < qbs.length; qb1++) {
    for (var rb1 = 0; rb1 < rbs.length; rb1++) {
        for (var rb2 = 1; rb2 < rbs.length; rb2++) {
            for (var wr1 = 0; wr1 < wrs.length; wr1++) {
                for (var wr2 = 1; wr2 < wrs.length; wr2++) {
                    for (var wr3 = 2; wr3 < wrs.length; wr3++) {
                        for (var te1 = 0; te1 < tes.length; te1++) {
                            for (var def1 = 0; def1 < dst.length; def1++) {
                                for (var k1 = 0; k1 < kck.length; k1++) {
                                    if (rb1 < rb2 && wr1 < wr2 && wr2 < wr3) {
                                        tempteam = [ qbs[qb1], rbs[rb1], rbs[rb2], wrs[wr1], wrs[wr2], wrs[wr3], tes[te1], dst[def1], kck[k1] ];
                                        potentialteams.push(tempteam);
                                        tempteam = [];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
     }
}
console.log(potentialteams);

var eligibleteams = [];
var teamSalary = 0;
var teamPotential = 0;


// Eliminate all teams above the salary cap and any that don't meet a high teamPotential.
potentialteams.forEach(function(team, index) {
    teamSalary = 0;
    teamPotential = 0;
    team.forEach(function(pos, ind) {
        teamSalary += pos.FanDuelSalary;
        teamPotential += pos.ProjectedFantasyPoints;
    });
    if (teamSalary < 60000 && teamPotential > 127.11) {
        team.potential = teamPotential;
        team.salary = teamSalary;
        eligibleteams.push(team);
    }
});
// Show top, eligible teams to chose from.
console.log(eligibleteams);

var showTeam = eligibleteams[0];
console.log(showTeam);
console.log(showTeam[0].Name);

var posArray = ["QB", "RB1", "RB2", "WR1", "WR2", "WR3", "TE", "K", "DEF"];

$(document).ready(function() {
    
    for (var i = 0; i < 9; i++) {
        $('#' + posArray[i])
            .append($('<td>').text(posArray[i]))
            .append($('<td>').text(showTeam[i].Name))
            .append($('<td>').text("$" + showTeam[i].FanDuelSalary))
            .append($('<td>').text(showTeam[i].ProjectedFantasyPoints + " Points"));
    }
    
    var $tot = $('<h2>').text("Team Projected: " + showTeam.potential);
    var $sal = $('<h2>').text("Team Salary: $" + showTeam.salary);
    $('.totals').append('<hr />').append($tot).append($sal);
});