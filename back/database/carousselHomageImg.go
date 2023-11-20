package database

import "go.mongodb.org/mongo-driver/bson/primitive"

type CarousselHomageImg struct {
	ID      primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Img     string             `json:"img" bson:"img"`
	AltName string             `json:"altName" bson:"altName"`
}
