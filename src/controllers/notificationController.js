import {notification} from '../sevices/index';

let readMore = async (req,res) =>{ 
  try {
    let skipNumberNotification = +(req.params.skipNumber);
    let newNotification = await notification.readMore(req.user._id, skipNumberNotification);

    return res.status(200).send(newNotification);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  readMore : readMore
}