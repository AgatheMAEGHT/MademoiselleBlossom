package database

import "go.mongodb.org/mongo-driver/bson/primitive"

type Article struct {
	ID          primitive.ObjectID   `json:"_id" bson:"_id,omitempty"`
	Name        string               `json:"name" bson:"name"`
	Pictures    []string             `json:"pictures" bson:"pictures"`
	Price       float64              `json:"price" bson:"price"`
	Stock       int                  `json:"stock" bson:"stock"`
	Colors      []primitive.ObjectID `json:"colors" bson:"colors"`
	Tones       []primitive.ObjectID `json:"tones" bson:"tones"`
	Size        float64              `json:"size" bson:"size"`
	Shape       string               `json:"shape" bson:"shape"`
	ArticleType primitive.ObjectID   `json:"type" bson:"type"`
}
