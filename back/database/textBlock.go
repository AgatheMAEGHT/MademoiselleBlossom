package database

import "go.mongodb.org/mongo-driver/bson/primitive"

type TextBlock struct {
	ID      primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Content string             `json:"content" bson:"content"`
	Name    string             `json:"name" bson:"name"`
}
