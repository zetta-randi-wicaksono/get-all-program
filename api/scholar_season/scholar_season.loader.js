const DataLoader = require('dataloader');
const ScholarSeason = require('./scholar_season.model');

const batchScholarSeasons = async (scholarSeasonIds) => {
  const scholarSeasons = await ScholarSeason.find({ _id: { $in: scholarSeasonIds } });
  return scholarSeasonIds.map((scholarSeasonId) =>
    scholarSeasons.find((scholarSeason) => scholarSeason._id.toString() === scholarSeasonId.toString())
  );
};

const scholarSeasonLoader = new DataLoader(batchScholarSeasons);

module.exports = scholarSeasonLoader;
