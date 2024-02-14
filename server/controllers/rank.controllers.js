import Rank from "../models/rank.model.js";
import User from "../models/user.model.js";

export const getRankName = async (req, res) => {
  const { rankId, highestRankId } = req.body;



  try {
    // Find the ranks for rankId and highestRankId
    const rank = await Rank.findOne({ where: { id: rankId }, attributes: ['name'] });
    const highestRank = await Rank.findOne({ where: { id: highestRankId }, attributes: ['name'] });

    // Extract names from the retrieved ranks
    const rankNames = {
      rankId: rank ? rank.name : null,
      highestRankId: highestRank ? highestRank.name : null
    };

    res.status(200).json(rankNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getNextRankById = async (req, res) => {
  const {id} = req.user

  try {
    const user = await User.findOne({
      where: {
        idUser: id
      },
      include: [
        { model: Rank, attributes: ['id', 'name', "right", "left"] }
      ]
    });

    const nextRank = await Rank.findOne({
      where: {
        id: user.rank.id + 1
      }
    })

    res.status(200).json(nextRank)


  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}


export const getNextRankByIdNode = async (req, res) => {
  const {id} = req.body

  try {
    const user = await User.findOne({
      where: {
        idUser: id
      },
      include: [
        { model: Rank, attributes: ['id', 'name', "right", "left"] }
      ]
    });

    const nextRank = await Rank.findOne({
      where: {
        id: user.rank.id + 1
      }
    })

    res.status(200).json({nextRank, rank: user.rank})


  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

export const addRank = async (req, res) => {
  const {rank} = req.body

  try {
    const newRank = await Rank.create(
      {
        name: rank.name,
          commission: rank.commission,
          points: rank.points,
          left: rank.left,
          right: rank.right,
          topPayMonth: rank.topPayMonth,
          topPayWeek: rank.topPayWeek
      }
    )

    res.status(200).json(newRank)

  } catch (error) {
    res.status(500).json(error)
  }
}