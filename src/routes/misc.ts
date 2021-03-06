import { Request, Router } from "express";
import { protect } from "../middlewares/currentUser";
import asyncHandler from "express-async-handler";
import { Response } from "express";
import { NextFunction } from "express";
import validationMiddleware from "../middlewares/validationMiddleware";
import { createVoteDto } from "../dto/misc.dto";
import { Post } from "../entities/Post";
import AppError from "../utils/appError";
import { Vote } from "../entities/Vote";
import { Comment } from "../entities/Comment";
import { User } from "../entities/User";
import { user } from "../middlewares/user";
import { getConnection } from "typeorm";
import { Sub } from "../entities/Sub";

const vote = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, slug, commentIdentifier, value } = req.body;

    const user: User = res.locals.user;

    let post = await Post.findOne({ identifier, slug });

    if (!post) {
      return next(new AppError(400, "Something went wrong"));
    }

    let vote: Vote | undefined;
    let comment: Comment | undefined;

    if (commentIdentifier) {
      // If there is a comment identifier, find vote by comment
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier });

      vote = await Vote.findOne({ user, comment });
    } else {
      // Find vote by Post
      vote = await Vote.findOne({ user, post });
    }

    if (!vote && value === 0) {
      // if no vote && value === 0 return error
      return next(new AppError(404, "Vote not found"));
    } else if (!vote) {
      // If no vote, create it
      vote = new Vote({ user, value });

      if (comment) {
        vote.comment = comment;
      } else {
        vote.post = post;
      }

      await vote.save();
    } else if (value === 0) {
      // If Vote exists and value = 0, remote vote from DB
      await vote.remove();
    } else if (vote.value !== value) {
      // if vote and value has changed, update vote
      vote.value = value;
      await vote.save();
    }

    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ["comments", "comments.votes", "votes", "sub"] }
    );

    post.setUserVote(user);
    post.comments.forEach((comment) => comment.setUserVote(user));

    return res.status(200).json(post);
  }
);

const topSubs = asyncHandler(async (_: Request, res: Response) => {
  const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn" , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`;

  const subs = await getConnection()
    .createQueryBuilder()
    .select(
      `s.title, s.name, ${imageUrlExp}  as "imageUrl", count(p.id) as "postCount" `
    )
    .from(Sub, "s")
    .leftJoin(Post, "p", `s.name = p."subName"`)
    .groupBy('s.title, s.name, "imageUrl"')
    .orderBy(`"postCount"`, "DESC")
    .limit(5)
    .execute();

  res.status(200).json(subs);
});

const router = Router();

router.post("/vote", validationMiddleware(createVoteDto), user, protect, vote);

router.get("/top-subs", topSubs);

export { router as miscRouter };
