import { Box, BoxGroup, UserChoice } from "../models/box.model";

export const create = async (
    options: {
        date: number,
        rarity: string,
        max_users: number,
        gift: {
            expire_vip?: number,
            money?: number,
            spins?: number
        }
    }[],
) => {
    const boxes = await Promise.all(
        options.map(async (option) => {
            const { date, rarity, max_users, gift } = option;

            const box = await Box.create({
                date,
                rarity,
                max_users,
                gift
            });

            return { box_id: box._id, chosenCount: 0 };
        })
    );

    const boxGroup = await BoxGroup.create({
        boxes
    });

    return boxGroup;
};

export const read = async (box_group_id: string) => {
    const group = await BoxGroup.findById(box_group_id).lean();

    if (!group) {
        return null;
    }

    const box_ids = group.boxes.map((box: any) => box.box_id);

    const boxes = await Box.find({ _id: { $in: box_ids } }).lean();
    const userChoices = await UserChoice.find({ box_id: { $in: box_ids } }).lean();

    return {
        group,
        boxes,
        userChoices
    };
};

export const update = async (options: { user_id: string, box_id: string, box_group_id: string }) => {
    const { box_id, box_group_id } = options;

    const [boxExists, boxGroupExists] = await Promise.all([
        Box.exists({ _id: box_id }),
        BoxGroup.exists({ _id: box_group_id })
    ]);

    const updatedGroup = await BoxGroup.findOneAndUpdate(
        { _id: box_group_id, 'boxes.box_id': box_id },
        { $inc: { 'boxes.$.chosen_count': 1 } },
        { new: true }
    );

    if (!boxExists || !boxGroupExists || !updatedGroup) {
        return null;
    }

    return await UserChoice.create(options);
}