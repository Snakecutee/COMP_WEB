const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RefresehTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users" },
  token: String,
  expiredDate: Date,
  created: { type: Date, default: Date.now },
  createdByIp: String,
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String,
});

RefresehTokenSchema.virtual("isExpired").get(function () {
  return Date.now() >= this.expires;
});

RefresehTokenSchema.virtual("isActive").get(function () {
  return !this.revoked && !this.isExpired;
});


RefresehTokenSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.id;
  },
});


const RefresehTokenModel = mongoose.model("refresh-token", RefresehTokenSchema);

module.exports = RefresehTokenModel;