const pb = {
    le: '<:lbv1:1268594620334604379>',
    me: '<:lbv2:1268594621555151001>',
    re: '<:lbv3:1268594622582489098>',
    lf: '<:lbp1:1268594623249649768>',
    mf: '<:lbp2:1268594624642158744>',
    rf: '<:lbp3:1268594625862438973>',
  };
   
  function formatResults(upvotes = [], downvotes = []) {
    const totalVotes = upvotes.length + downvotes.length;
    const progressBarLength = 14;
    const filledSquares = Math.round((upvotes.length / totalVotes) * progressBarLength) || 0;
    const emptySquares = progressBarLength - filledSquares || 0;
   
    if (!filledSquares && !emptySquares) {
      emptySquares = progressBarLength;
    }
   
    const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
    const downPercentage = (downvotes.length / totalVotes) * 100 || 0;
   
    const progressBar =
      (filledSquares ? pb.lf : pb.le) +
      (pb.mf.repeat(filledSquares) + pb.me.repeat(emptySquares)) +
      (filledSquares === progressBarLength ? pb.rf : pb.re);
   
    const results = [];
    results.push(
      `<:LikedSummaryIcon:1268926463256825857> ${upvotes.length} pour (${upPercentage.toFixed(1)}%) • <:DislikedSummaryIcon:1268926465626603563> ${
        downvotes.length
      } contres (${downPercentage.toFixed(1)}%)`
    );
    results.push(progressBar);
   
    return results.join('\n');
  }
   
  module.exports = formatResults;
  