package database

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

var (
	UserCollection *mongo.Collection
)

type User struct {
	ID        primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Email     string             `json:"email" bson:"email"`
	Phone     string             `json:"phone" bson:"phone"`
	FirstName string             `json:"firstName" bson:"firstName"`
	LastName  string             `json:"lastName" bson:"lastName"`
	Password  string             `json:"-" bson:"password"`
	IsAdmin   bool               `json:"isAdmin" bson:"isAdmin" default:"false"`
}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashedPassword), err
}

func (u *User) ComparePassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
}

func (u *User) CreateOne(ctx context.Context) (*mongo.InsertOneResult, error) {
	var err error
	u.Password, err = HashPassword(u.Password)
	if err != nil {
		return nil, err
	}

	res, err := UserCollection.InsertOne(ctx, u)
	if err != nil {
		return nil, err
	}

	u.ID = res.InsertedID.(primitive.ObjectID)
	return res, nil
}

func (u *User) UpdatePassword(ctx context.Context, password string) error {
	var err error
	u.Password, err = HashPassword(password)
	if err != nil {
		return err
	}

	_, err = UserCollection.UpdateOne(ctx, bson.M{"_id": u.ID}, bson.M{"$set": bson.M{"password": u.Password}})
	return err
}

func (u *User) UpdateOne(ctx context.Context) (*mongo.UpdateResult, error) {
	return UserCollection.UpdateOne(ctx, bson.M{"_id": u.ID}, bson.M{"$set": u})
}

func FindOneUser(ctx context.Context, query bson.M) (User, error) {
	user := User{}
	err := UserCollection.FindOne(ctx, query).Decode(&user)
	return user, err
}

func DeleteOneUser(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return UserCollection.DeleteOne(ctx, bson.M{"_id": id})
}

func initUser(ctx context.Context, db *mongo.Database) {
	UserCollection = db.Collection("users")
	// Create index on email
	UserCollection.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    map[string]int{"email": 1},
		Options: options.Index().SetUnique(true),
	})
}
