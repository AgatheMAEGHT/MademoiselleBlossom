package database

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var (
	FavoriteCollection *mongo.Collection
)

type FavoriteRes struct {
	ID        primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Article   *ArticleRes        `json:"article" bson:"article"`
	User      primitive.ObjectID `json:"user" bson:"user"`
	CreatedAt primitive.DateTime `json:"createdAt" bson:"createdAt"`
}

type Favorite struct {
	ID        primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Article   primitive.ObjectID `json:"article" bson:"article"`
	User      primitive.ObjectID `json:"user" bson:"user"`
	CreatedAt primitive.DateTime `json:"createdAt" bson:"createdAt"`
}

func (a *Favorite) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	favorites, err := FindFavorites(ctx, bson.M{"article": a.Article, "user": a.User})
	if err != nil {
		return nil, err
	}
	if len(favorites) > 0 {
		return nil, fmt.Errorf("Favorite already exists")
	}

	a.CreatedAt = primitive.NewDateTimeFromTime(time.Now())

	res, err := FavoriteCollection.InsertOne(ctx, a)
	if err != nil {
		return nil, err
	}

	a.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (a *Favorite) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return FavoriteCollection.UpdateOne(ctx, bson.M{"_id": a.ID}, bson.M{"$set": a})
}

func DeleteOneFavorite(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return FavoriteCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func FindOneFavorite(ctx context.Context, filter bson.M) (*Favorite, error) {
	var a Favorite
	err := FavoriteCollection.FindOne(ctx, filter).Decode(&a)
	return &a, err
}

func FindFavorites(ctx context.Context, filter bson.M) ([]*Favorite, error) {
	cursor, err := FavoriteCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var favorites []*Favorite
	for cursor.Next(ctx) {
		var a Favorite
		err := cursor.Decode(&a)
		if err != nil {
			return nil, err
		}
		favorites = append(favorites, &a)
	}

	return favorites, nil
}

func (a *Favorite) Populate(ctx context.Context) (*FavoriteRes, error) {
	article, err := FindOneArticle(ctx, bson.M{"_id": a.Article})
	if err != nil {
		return nil, err
	}

	articleRes, err := article.Populate(ctx)
	if err != nil {
		return nil, err
	}

	return &FavoriteRes{
		ID:        a.ID,
		Article:   articleRes,
		User:      a.User,
		CreatedAt: a.CreatedAt,
	}, nil
}

func initFavorite(ctx context.Context, db *mongo.Database) {
	FavoriteCollection = db.Collection("favorites")
}
