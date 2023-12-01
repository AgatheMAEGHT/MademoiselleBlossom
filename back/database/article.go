package database

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	ArticleCollection *mongo.Collection
)

type ArticleRes struct {
	ID          primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name        string             `json:"name" bson:"name"`
	Description string             `json:"description" bson:"description"`
	Files       []string           `json:"files" bson:"files"`
	Price       float64            `json:"price" bson:"price"`
	Stock       int                `json:"stock" bson:"stock"`
	Tones       []*ArticleTone     `json:"tones" bson:"tones"`
	Size        float64            `json:"size" bson:"size"`
	Shape       *ArticleShape      `json:"shape" bson:"shape"`
	Type        *ArticleType       `json:"type" bson:"type"`
	Colors      []*ArticleColor    `json:"colors" bson:"colors"`
	CreatedAt   primitive.DateTime `json:"createdAt" bson:"createdAt"`
}

type Article struct {
	ID          primitive.ObjectID   `json:"_id" bson:"_id,omitempty"`
	Name        string               `json:"name" bson:"name"`
	Description string               `json:"description" bson:"description"`
	Files       []primitive.ObjectID `json:"files" bson:"files"`
	Price       float64              `json:"price" bson:"price"`
	Stock       int                  `json:"stock" bson:"stock"`
	Tones       []primitive.ObjectID `json:"tones" bson:"tones"`
	Size        float64              `json:"size" bson:"size"`
	Shape       primitive.ObjectID   `json:"shape" bson:"shape"`
	Type        primitive.ObjectID   `json:"type" bson:"type"`
	Colors      []primitive.ObjectID `json:"colors" bson:"colors"`
	CreatedAt   primitive.DateTime   `json:"createdAt" bson:"createdAt"`
}

func (a *Article) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	a.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
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

func (a *Article) Populate(ctx context.Context) (*ArticleRes, error) {
	var articleRes ArticleRes
	articleRes.ID = a.ID
	articleRes.Name = a.Name
	articleRes.Description = a.Description
	articleRes.Price = a.Price
	articleRes.Stock = a.Stock
	articleRes.Size = a.Size

	articleType, err := FindOneArticleType(ctx, bson.M{"_id": a.Type})
	if err != nil {
		return nil, err
	}
	articleRes.Type = articleType

	articleShape, err := FindOneArticleShape(ctx, bson.M{"_id": a.Shape})
	if err != nil {
		return nil, err
	}
	articleRes.Shape = articleShape

	articleColors, err := FindArticleColors(ctx, bson.M{"_id": bson.M{"$in": a.Colors}})
	if err != nil {
		return nil, err
	}
	articleRes.Colors = articleColors

	articleTones, err := FindArticleTones(ctx, bson.M{"_id": bson.M{"$in": a.Tones}})
	if err != nil {
		return nil, err
	}
	articleRes.Tones = articleTones

	files, err := FindFiles(ctx, bson.M{"_id": bson.M{"$in": a.Files}})
	articleRes.Files = make([]string, 0, len(files))
	if err != nil {
		return nil, err
	}
	for _, file := range files {
		articleRes.Files = append(articleRes.Files, file.FullName())
	}

	return &articleRes, nil
}

func initArticle(ctx context.Context, db *mongo.Database) {
	ArticleCollection = db.Collection("articles")

	ArticleCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.M{"name": 1},
		Options: options.Index().SetUnique(true),
	})
}
