package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	ArticleTypeCollection *mongo.Collection
)

type ArticleType struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name string             `json:"name" bson:"name"`
}

func (a *ArticleType) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := ArticleTypeCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *ArticleType) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return ArticleTypeCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneArticleType(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return ArticleTypeCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneArticleType(ctx context.Context, filter bson.M) (*ArticleType, error) {
	var a ArticleType
	err := ArticleTypeCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindArticleTypes(ctx context.Context, filter bson.M) ([]*ArticleType, error) {
	cursor, err := ArticleTypeCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var articleTypes []*ArticleType
	for cursor.Next(ctx) {
		var a ArticleType
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		articleTypes = append(articleTypes, &a)
	}

	return articleTypes, nil
}

func initArticleType(ctx context.Context, db *mongo.Database) {
	ArticleTypeCollection = db.Collection("articleTypes")

	ArticleTypeCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"name": 1},
		Options: options.Index().SetUnique(true),
	})
}
