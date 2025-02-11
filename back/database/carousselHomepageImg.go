package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	CarousselHomepageImgCollection *mongo.Collection
)

type CarousselHomepageImgRes struct {
	ID      primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	File    string             `json:"file" bson:"file"`
	AltName string             `json:"altName" bson:"altName"`
}

type CarousselHomepageImg struct {
	ID      primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	File    primitive.ObjectID `json:"file" bson:"file"`
	AltName string             `json:"altName" bson:"altName"`
}

func (a *CarousselHomepageImg) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	res, err := CarousselHomepageImgCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *CarousselHomepageImg) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return CarousselHomepageImgCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneCarousselHomepageImg(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return CarousselHomepageImgCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneCarousselHomepageImg(ctx context.Context, filter bson.M) (*CarousselHomepageImg, error) {
	var a CarousselHomepageImg
	err := CarousselHomepageImgCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindCarousselHomepageImgs(ctx context.Context, filter bson.M) ([]*CarousselHomepageImg, error) {
	cursor, err := CarousselHomepageImgCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var carousselHomepageImgs []*CarousselHomepageImg
	for cursor.Next(ctx) {
		var a CarousselHomepageImg
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		carousselHomepageImgs = append(carousselHomepageImgs, &a)
	}

	return carousselHomepageImgs, nil
}

func (a *CarousselHomepageImg) Populate(ctx context.Context) (*CarousselHomepageImgRes, error) {
	file, err := FindOneFile(ctx, bson.M{"_id": a.File})
	if err != nil {
		return nil, err
	}

	return &CarousselHomepageImgRes{
		ID:      a.ID,
		File:    file.FullName(),
		AltName: a.AltName,
	}, nil
}

func initCarousselHomepageImg(ctx context.Context, db *mongo.Database) {
	_ = ctx
	CarousselHomepageImgCollection = db.Collection("carousselHomepageImgs")
}
