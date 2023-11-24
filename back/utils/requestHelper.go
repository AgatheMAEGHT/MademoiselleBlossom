package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"io"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func ParseBody(body io.ReadCloser, data interface{}) error {
	defer body.Close()
	return json.NewDecoder(body).Decode(data)
}

func IsObjectIdExist(id primitive.ObjectID, collection *mongo.Collection) *ResErr {
	res := collection.FindOne(context.Background(), bson.M{
		"_id": id,
	})

	if res.Err() != nil {
		return NewResErr(fmt.Sprintf("_id not found: %s", id.Hex()))
	}

	return nil
}

func IsListObjectIdExist(ids []primitive.ObjectID, collection *mongo.Collection) *ResErr {
	for _, id := range ids {
		err := IsObjectIdExist(id, collection)
		if err != nil {
			return err
		}
	}

	return nil
}

func IsStringObjectIdValid(id string, collection *mongo.Collection) *ResErr {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return NewResErr(fmt.Sprintf("Invalid _id: %s", id))
	}

	res := collection.FindOne(context.Background(), bson.M{
		"_id": objID,
	})

	if res.Err() != nil {
		return NewResErr(fmt.Sprintf("_id not found: %s", id))
	}

	return nil
}

func IsStringListObjectIdValid(ids []string, collection *mongo.Collection) *ResErr {
	for _, id := range ids {
		err := IsStringObjectIdValid(id, collection)
		if err != nil {
			return err
		}
	}

	return nil
}

func GetObjectIdsInField(ctx context.Context, field string, body map[string]interface{}, collection *mongo.Collection) ([]primitive.ObjectID, *ResErr) {
	idStr, ok := body[field].([]string)
	if !ok {
		return nil, NewResErr(fmt.Sprintf("Invalid %s", field))
	}

	ids := []primitive.ObjectID{}
	for _, fileID := range idStr {
		id, err := primitive.ObjectIDFromHex(fileID)
		if err != nil {
			return nil, NewResErr(fmt.Sprintf("Invalid %s id: %s", field, fileID))
		}

		res := collection.FindOne(ctx, bson.M{
			"_id": id,
		})
		if res.Err() != nil {
			return nil, NewResErr(fmt.Sprintf("Invalid %s id: %s", field, fileID))
		}

		ids = append(ids, id)
	}

	return ids, nil
}
