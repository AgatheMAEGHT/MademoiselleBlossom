package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TextBlock struct {
	ID      primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Content string             `json:"content" bson:"content"`
	Name    string             `json:"name" bson:"name"`
}

var (
	TextBlockCollection *mongo.Collection
)

func (a *TextBlock) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := TextBlockCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *TextBlock) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return TextBlockCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneTextBlock(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return TextBlockCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneTextBlock(ctx context.Context, filter bson.M) (*TextBlock, error) {
	var a TextBlock
	err := TextBlockCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindTextBlocks(ctx context.Context, filter bson.M) ([]*TextBlock, error) {
	cursor, err := TextBlockCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var textBlock []*TextBlock
	for cursor.Next(ctx) {
		var a TextBlock
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		textBlock = append(textBlock, &a)
	}

	return textBlock, nil
}

func initTextBlock(ctx context.Context, db *mongo.Database) {
	TextBlockCollection = db.Collection("textBlocks")

	TextBlockCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"name": 1},
		Options: options.Index().SetUnique(true),
	})
}
