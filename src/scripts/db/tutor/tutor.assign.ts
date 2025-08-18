// scripts/setup-tutor.ts
// Script to convert any user to a TUTOR with basic profile
// Run with: npm run setup:tutor <email>

import { prisma  } from "@/lib/db/prisma"
import { UserRole } from "@/generated/prisma"

async function setupTutor(email: string) {
  console.log(`🎓 TUTOR SETUP: Converting user to TUTOR role`);
  console.log(`📧 Email: ${email}\n`);

  try {
    // Step 1: Find the user
    console.log('🔍 Step 1: Finding user...');
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tutorProfile: true,
        studentProfile: true,
        adminProfile: true,
      }
    });

    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
      
      // Show available users
      const allUsers = await prisma.user.findMany({
        select: { email: true, name: true, role: true },
        take: 10,
      });
      
      if (allUsers.length > 0) {
        console.log('\n📋 Available users:');
        allUsers.forEach(u => {
          console.log(`   - ${u.email} (${u.name}) - ${u.role}`);
        });
      }
      
      return false;
    }

    console.log(`✅ Found user: ${user.name} (${user.id})`);
    console.log(`   Current role: ${user.role}`);
    console.log(`   Existing profiles:`);
    console.log(`     - Student: ${user.studentProfile ? '✅' : '❌'}`);
    console.log(`     - Tutor: ${user.tutorProfile ? '✅' : '❌'}`);
    console.log(`     - Admin: ${user.adminProfile ? '✅' : '❌'}`);

    // Step 2: Check if already a tutor
    if (user.role === 'TUTOR' && user.tutorProfile) {
      console.log('\n✅ User is already a TUTOR with profile');
      console.log(`   Bio: "${user.tutorProfile.bio || 'None'}"`);
      console.log(`   Hourly Rate: $${user.tutorProfile.hourlyRate || 'Not set'}`);
      console.log('✅ No changes needed');
      return true;
    }

    // Step 3: Show what will happen
    console.log('\n📊 Changes to be made:');
    console.log(`   Role: ${user.role} → TUTOR`);
    console.log(`   Tutor Profile: Will be created`);
    
    if (user.studentProfile || user.adminProfile) {
      console.log('\n⚠️  Existing profiles that will be removed:');
      if (user.studentProfile) console.log('     - Student profile');
      if (user.adminProfile) console.log('     - Admin profile');
    }

    console.log('\n⏳ Proceeding in 2 seconds... (Ctrl+C to cancel)');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 4: Execute the conversion
    console.log('\n🔄 Step 2: Converting to TUTOR...');

    await prisma.$transaction(async (tx) => {
      // Delete existing profiles that conflict
      if (user.studentProfile) {
        await tx.studentProfile.delete({
          where: { userId: user.id }
        });
        console.log('   ✅ Removed student profile');
      }

      if (user.adminProfile) {
        await tx.adminProfile.delete({
          where: { userId: user.id }
        });
        console.log('   ✅ Removed admin profile');
      }

      // Update user role
      await tx.user.update({
        where: { id: user.id },
        data: { role: UserRole.TUTOR }
      });
      console.log('   ✅ Updated user role to TUTOR');

      // Create basic tutor profile (no bio or hourlyRate required)
      await tx.tutorProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          // bio and hourlyRate are optional, so we can omit them
        },
        update: {
          // Keep existing bio/rate if updating
        }
      });
      console.log('   ✅ Created tutor profile');
    });

    // Step 5: Verification
    console.log('\n🔍 Step 3: Verifying setup...');
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        tutorProfile: true,
        studentProfile: true,
        adminProfile: true,
      }
    });

    if (updatedUser?.role === 'TUTOR' && updatedUser.tutorProfile) {
      console.log('✅ Verification successful!');
      console.log('\n🎉 TUTOR SETUP COMPLETE!');
      console.log(`👤 User: ${updatedUser.name} (${updatedUser.email})`);
      console.log(`🎭 Role: ${updatedUser.role}`);
      console.log(`📅 Profile created: ${updatedUser.tutorProfile.createdAt}`);
      
      console.log('\n📋 Profile status:');
      console.log(`   - Student profile: ${updatedUser.studentProfile ? '✅' : '❌'}`);
      console.log(`   - Tutor profile: ${updatedUser.tutorProfile ? '✅' : '❌'}`);
      console.log(`   - Admin profile: ${updatedUser.adminProfile ? '✅' : '❌'}`);

      console.log('\n💡 Next steps:');
      console.log('   - User can now access tutor features');
      console.log('   - Bio and hourly rate can be added later via UI');
      console.log('   - Additional tutor details can be configured');

      return true;
    } else {
      console.log('❌ Verification failed - setup incomplete');
      return false;
    }

  } catch (error) {
    console.error('💥 Error during tutor setup:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line
const userEmail = process.argv[2];

if (!userEmail) {
  console.log('❌ Please provide a user email');
  console.log('Usage: npm run setup:tutor <email>');
  console.log('Example: npm run setup:tutor alice@example.com');
  process.exit(1);
}

// Run the setup
setupTutor(userEmail)
  .then(success => {
    console.log(`\n📊 Tutor setup ${success ? 'COMPLETED' : 'FAILED'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Setup crashed:', error);
    process.exit(1);
  });