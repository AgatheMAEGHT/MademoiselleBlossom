package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	ArticleCollection *mongo.Collection
)

type Article struct {
	ID          primitive.ObjectID   `json:"_id" bson:"_id,omitempty"`
	Name        string               `json:"name" bson:"name"`
	Description string               `json:"description" bson:"description"`
	Files       []primitive.ObjectID `json:"files" bson:"files"`
	Price       float64              `json:"price" bson:"price"`
	Stock       int                  `json:"stock" bson:"stock"`
	Tones       []primitive.ObjectID `json:"tones" bson:"tones"`
	Size        float64              `json:"size" bson:"size"`
	Shape       string               `json:"shape" bson:"shape"`
	ArticleType primitive.ObjectID   `json:"type" bson:"type"`
	Colors      []primitive.ObjectID `json:"colors" bson:"colors"`
}

func (a *Article) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := ArticleCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *Article) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return ArticleCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneArticle(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return ArticleCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneArticle(ctx context.Context, filter bson.M) (*Article, error) {
	var a Article
	err := ArticleCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindArticles(ctx context.Context, filter bson.M, opts ...*options.FindOptions) ([]*Article, error) {
	cursor, err := ArticleCollection.Find(ctx, filter, opts...)
	if err != nil {
		return nil, err
	}

	var articles []*Article
	for cursor.Next(ctx) {
		var a Article
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		articles = append(articles, &a)
	}

	return articles, nil
}

func initArticle(ctx context.Context, db *mongo.Database) {
	ArticleCollection = db.Collection("articles")

	ArticleCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"name": 1},
		Options: options.Index().SetUnique(true),
	})
}
