package database

import (
	"MademoiselleBlossom/utils"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const TempCartExpiration = 60 * 60

var (
	TempCartCollection *mongo.Collection
)

type TempCart struct {
	ID        primitive.ObjectID   `json:"_id" bson:"_id,omitempty"`
	CreatedAt primitive.DateTime   `json:"createdAt" bson:"createdAt"`
	User      primitive.ObjectID   `json:"user" bson:"user"`
	Articles  []primitive.ObjectID `json:"articles" bson:"articles"`
	Quantity  []int                `json:"quantity" bson:"quantity"`
}

func (a *TempCart) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	a.CreatedAt = primitive.NewDateTimeFromTime(time.Now())

	articles, err := FindArticles(ctx, bson.M{"_id": bson.M{"$in": a.Articles}})
	if err != nil {
		return nil, err
	}

	if len(articles) != len(a.Articles) {
		return nil, utils.NewResErr("Invalid articles")
	}

	for i, article := range articles {
		if article.Stock < a.Quantity[i] {
			return nil, utils.NewResErr("Not enough quantity")
		}
	}

	for i, article := range articles {
		article.Stock -= a.Quantity[i]
		_, err := article.UpdateOne(ctx)
		if err != nil {
			return nil, err
		}
	}

	res, err := TempCartCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *TempCart) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return TempCartCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func (a *TempCart) DeleteOne(ctx context.Context) (*mongo.DeleteResult, error) {
	articles, err := FindArticles(ctx, bson.M{"_id": bson.M{"$in": a.Articles}})
	if err != nil {
		return nil, err
	}

	for i, article := range articles {
		article.Stock += a.Quantity[i]
		_, err := article.UpdateOne(ctx)
		if err != nil {
			return nil, err
		}
	}

	return TempCartCollection.DeleteOne(ctx, bson.M{"_id": a.ID})
}

func FindOneTempCart(ctx context.Context, filter bson.M) (*TempCart, error) {
	var a TempCart
	err := TempCartCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindTempCarts(ctx context.Context, filter bson.M) ([]*TempCart, error) {
	cursor, err := TempCartCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var tempCarts []*TempCart
	for cursor.Next(ctx) {
		var a TempCart
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		tempCarts = append(tempCarts, &a)
	}

	return tempCarts, nil
}

func initTempCart(ctx context.Context, db *mongo.Database) {
	TempCartCollection = db.Collection("tempCarts")

	TempCartCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"user": 1},
		Options: options.Index().SetUnique(true),
	})
}
