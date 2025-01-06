const express = require("express");
const prisma = require("../prisma/client");

// find user
const getAllUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        socialLinks: true,
        devices: {
          select: {
            id: true,
            name: true,
            codename: true,
          },
        },
      },
    });

    // remove sensitive data
    const sanitizedUsers = users.map(user => {
      const { accessToken, ...sanitizedUsers } = user;
      return sanitizedUsers;
    });

    res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      data: sanitizedUsers
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  };
};

// get user by id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate user ID
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    // Fetch user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        socialLinks: true,
        devices: {
          select: {
            id: true,
            name: true,
            codename: true,
          },
        },
      },
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Remove sensitive data
    const { accessToken, ...sanitizedUser } = user;

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: sanitizedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message
    });
  }
}
// create user
const createUser = async (req, res) => {
  try {
    const { username, accessToken, role, image, socialLinks } = req.body;
    const validRoles = ['ADMIN', 'FOUNDER', 'CO_FOUNDER', 'GROUP_SUPPORT', 'CORE_DEV', 'UI_UX_DESIGN', 'MAINTAINER'];

    // validate inputs
    if (!username ||!role) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields"
      });
    }

    if (!validRoles.includes(role)) {
      return res.status(400).send({
        success: false,
        message: "Invalid role",
        validRoles: validRoles
      });
    }

    // insert data
    const newUser = await prisma.user.create({
      data: {
        username,
        accessToken,
        role,
        image: image || undefined,
        socialLinks: {
          create: socialLinks?.map(link => ({
            platform: link.platform,
            icon: link.icon,
            url: link.url
          })) || []
        }
      },
      include: {
        socialLinks: true,
      }
    });

    // remove sensitive data
    const { accessToken: _,...sanitizedUser } = newUser;

    res.status(201).send({
      success: true,
      message: "User created successfully",
      data: sanitizedUser
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).send({
        success: false,
        message: "Username already exists"
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Failed to create user",
        error: error.message
      });
    }
  }
}

// update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role, image, socialLinks } = req.body;
    const validRoles = ['ADMIN', 'FOUNDER', 'CO_FOUNDER', 'GROUP_SUPPORT', 'CORE_DEV', 'UI_UX_DESIGN', 'MAINTAINER'];

    // validate user id
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user ID"
      });
    }

    // check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    // prepare update data
    const updateData = {};

    if (username !== undefined) updateData.username = username;
    if (role !== undefined && validRoles.includes(role)) updateData.role = role;
    if (image !== undefined) updateData.image = image;

    // handle social Links update
    if (socialLinks !== undefined) {
      updateData.socialLinks = {
        deleteMany: {},
        create: socialLinks?.map(link => ({
          platform: link.platform,
          icon: link.icon,
          url: link.url
        }))
      };
    }

    // update user
    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        socialLinks: true
      }
    });

    // remove sensitive data
    const { accessToken: _,...sanitizedUser } = updateUser;

    res.status(200).send({
      success: true,
      message: "User updated successfully",
      data: sanitizedUser
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).send({
        success: false,
        message: "Username already exists"
      });
    } else {
      res.status(500).send({
        success: false,
        message: "Failed to update user",
        error: error.message
      });
    }
  };
}

// delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // validate user id
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user ID"
      });
    }

    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { socialLinks: true },
    });
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    // delete user with associated data
    await prisma.$transaction(async (prisma) => {
      await prisma.user.delete({ where: { id: userId } });
      await prisma.socialLink.deleteMany({ where: { userId } });
    });

    // Send success response
    res.status(200).send({
      success: true,
      message: "User and associated data deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Failed to delete user",
      error: error.message
    });
  }
}

module.exports = {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};