package database

import "go.mongodb.org/mongo-driver/bson/primitive"

type Color struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name string             `json:"name" bson:"name"`
	Hexa string             `json:"hexa" bson:"hexa"`
}
